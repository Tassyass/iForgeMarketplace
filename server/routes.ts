import { type Express } from "express";
import { db } from "db";
import { models, users, analytics } from "db/schema";
import { eq } from "drizzle-orm";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the destination folder based on file type
    const folder = file.fieldname === 'model' ? 'models' : 'thumbnails';
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    
    // Create directories if they don't exist
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter function
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'model') {
    // Accept only 3D model files
    const validExtensions = ['.glb', '.gltf', '.obj'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (validExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid model file type. Supported formats: GLB, GLTF, OBJ'));
    }
  } else if (file.fieldname === 'thumbnail') {
    // Accept only image files
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (validExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Supported formats: JPG, PNG, WEBP'));
    }
  } else {
    cb(new Error('Unexpected field'));
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 2 // Maximum 2 files (model and thumbnail)
  }
});

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Get all models
  app.get("/api/models", async (req, res) => {
    try {
      const allModels = await db.select()
        .from(models)
        .leftJoin(users, eq(models.creatorId, users.id));

      res.json(allModels.map(model => ({
        ...model.models,
        creatorName: model.users?.username ?? 'Unknown Creator'
      })));
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ message: "Error fetching models" });
    }
  });

  // Get single model
  app.get("/api/models/:id", async (req, res) => {
    try {
      const modelId = parseInt(req.params.id);
      if (isNaN(modelId)) {
        return res.status(400).json({ message: "Invalid model ID" });
      }

      const [model] = await db.select()
        .from(models)
        .where(eq(models.id, modelId))
        .leftJoin(users, eq(models.creatorId, users.id))
        .limit(1);

      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      res.json({
        ...model.models,
        creatorName: model.users?.username ?? 'Unknown Creator'
      });
    } catch (error) {
      console.error('Error fetching model:', error);
      res.status(500).json({ message: "Error fetching model" });
    }
  });

  // Create model (protected)
  app.post("/api/models", 
    upload.fields([
      { name: 'model', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    async (req, res) => {
      if (!req.isAuthenticated() || !req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        if (!files.model?.[0] || !files.thumbnail?.[0]) {
          return res.status(400).json({ message: "Both model and thumbnail files are required" });
        }

        const modelFile = files.model[0];
        const thumbnailFile = files.thumbnail[0];

        // Validate form data
        const { title, description, price, category, directPrintEnabled } = req.body;
        if (!title || !description || !price || !category) {
          // Clean up uploaded files if validation fails
          fs.unlinkSync(modelFile.path);
          fs.unlinkSync(thumbnailFile.path);
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Convert price from dollars to cents
        const priceInCents = Math.round(parseFloat(price) * 100);
        if (isNaN(priceInCents) || priceInCents < 0) {
          fs.unlinkSync(modelFile.path);
          fs.unlinkSync(thumbnailFile.path);
          return res.status(400).json({ message: "Invalid price" });
        }

        // Create model record in database
        const [newModel] = await db.insert(models)
          .values({
            title,
            description,
            price: priceInCents,
            category,
            directPrintEnabled: directPrintEnabled === 'true',
            creatorId: req.user.id,
            modelUrl: `/uploads/models/${modelFile.filename}`,
            thumbnailUrl: `/uploads/thumbnails/${thumbnailFile.filename}`,
            status: 'pending'
          })
          .returning();

        if (!newModel?.id) {
          throw new Error('Failed to create model record');
        }

        // Log model creation in analytics
        await db.insert(analytics).values({
          type: 'model_created',
          modelId: newModel.id,
          userId: req.user.id,
          metadata: { category, directPrintEnabled }
        });

        res.json(newModel);
      } catch (error) {
        // Clean up any uploaded files if the database operation fails
        if (req.files) {
          const files = req.files as { [fieldname: string]: Express.Multer.File[] };
          files.model?.[0] && fs.unlinkSync(files.model[0].path);
          files.thumbnail?.[0] && fs.unlinkSync(files.thumbnail[0].path);
        }

        console.error('Error creating model:', error);
        res.status(500).json({ message: "Error creating model" });
      }
    }
  );

  // Purchase model (protected)
  app.post("/api/models/:id/purchase", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const modelId = parseInt(req.params.id);
      if (isNaN(modelId)) {
        return res.status(400).json({ message: "Invalid model ID" });
      }

      const [model] = await db.select()
        .from(models)
        .where(eq(models.id, modelId))
        .limit(1);

      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      if (model.status !== 'active') {
        return res.status(400).json({ message: "Model is not available for purchase" });
      }

      // Log purchase in analytics
      await db.insert(analytics).values({
        type: 'model_purchased',
        modelId: model.id,
        userId: req.user.id,
        metadata: { price: model.price }
      });

      res.json({ message: "Purchase successful" });
    } catch (error) {
      console.error('Error processing purchase:', error);
      res.status(500).json({ message: "Error processing purchase" });
    }
  });

  // Request print (protected)
  app.post("/api/models/:id/print", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const modelId = parseInt(req.params.id);
      if (isNaN(modelId)) {
        return res.status(400).json({ message: "Invalid model ID" });
      }

      const [model] = await db.select()
        .from(models)
        .where(eq(models.id, modelId))
        .limit(1);

      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      if (!model.directPrintEnabled) {
        return res.status(400).json({ message: "Direct printing not available for this model" });
      }

      if (model.status !== 'active') {
        return res.status(400).json({ message: "Model is not available for printing" });
      }

      const printOptions = req.body.printOptions;
      if (!printOptions?.material || !printOptions?.color || !printOptions?.size) {
        return res.status(400).json({ message: "Invalid print options" });
      }

      // Log print request in analytics
      await db.insert(analytics).values({
        type: 'print_requested',
        modelId: model.id,
        userId: req.user.id,
        metadata: { printOptions }
      });

      res.json({ message: "Print request submitted" });
    } catch (error) {
      console.error('Error processing print request:', error);
      res.status(500).json({ message: "Error processing print request" });
    }
  });
}
