import { type Express } from "express";
import { db } from "db";
import { models, users, orders } from "db/schema";
import { eq } from "drizzle-orm";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Get all models
  app.get("/api/models", async (req, res) => {
    try {
      const allModels = await db.select().from(models)
        .leftJoin(users, eq(models.creatorId, users.id));
      res.json(allModels.map(model => ({
        ...model.models,
        creatorName: model.users.username
      })));
    } catch (error) {
      res.status(500).json({ message: "Error fetching models" });
    }
  });

  // Get single model
  app.get("/api/models/:id", async (req, res) => {
    try {
      const [model] = await db.select()
        .from(models)
        .where(eq(models.id, parseInt(req.params.id)))
        .leftJoin(users, eq(models.creatorId, users.id))
        .limit(1);

      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      res.json({
        ...model.models,
        creatorName: model.users.username
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching model" });
    }
  });

  // Create model (protected)
  app.post("/api/models", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const [newModel] = await db.insert(models)
        .values({
          ...req.body,
          creatorId: req.user.id
        })
        .returning();

      res.json(newModel);
    } catch (error) {
      res.status(500).json({ message: "Error creating model" });
    }
  });

  // Create order (protected)
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const [newOrder] = await db.insert(orders)
        .values({
          ...req.body,
          userId: req.user.id
        })
        .returning();

      res.json(newOrder);
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  });
}
