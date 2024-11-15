const fetch = require('node-fetch');

const models = [
  {
    title: "Gaming Console Controller Stand",
    description: "A sleek and ergonomic stand for gaming controllers, featuring built-in cable management and charging dock compatibility.",
    price: 1499,
    category: "Gaming",
    directPrintEnabled: true,
    thumbnailUrl: "https://via.placeholder.com/400x400.png?text=Gaming+Controller+Stand",
    modelUrl: "/uploads/models/sample.glb"
  },
  {
    title: "Gaming Headset Mount",
    description: "Under-desk headset mount with integrated cable routing and customizable RGB lighting strips.",
    price: 999,
    category: "Gaming",
    directPrintEnabled: true,
    thumbnailUrl: "https://via.placeholder.com/400x400.png?text=Gaming+Headset+Mount",
    modelUrl: "/uploads/models/sample.glb"
  },
  {
    title: "Mechanical Keyboard Case",
    description: "Custom mechanical keyboard case with adjustable typing angle and sound dampening features.",
    price: 3999,
    category: "Mechanical",
    directPrintEnabled: true,
    thumbnailUrl: "https://via.placeholder.com/400x400.png?text=Mechanical+Keyboard",
    modelUrl: "/uploads/models/sample.glb"
  },
  {
    title: "Mechanical Watch Stand",
    description: "Elegant watch display stand with integrated winding mechanism support.",
    price: 2499,
    category: "Mechanical",
    directPrintEnabled: false,
    thumbnailUrl: "https://via.placeholder.com/400x400.png?text=Watch+Stand",
    modelUrl: "/uploads/models/sample.glb"
  },
  {
    title: "Abstract Sculpture - Waves",
    description: "Modern abstract sculpture featuring fluid wave patterns, perfect for contemporary spaces.",
    price: 4999,
    category: "Art",
    directPrintEnabled: true,
    thumbnailUrl: "https://via.placeholder.com/400x400.png?text=Abstract+Waves",
    modelUrl: "/uploads/models/sample.glb"
  },
  {
    title: "Art Deco Vase",
    description: "Geometric art deco vase with intricate patterns and customizable size options.",
    price: 3499,
    category: "Art",
    directPrintEnabled: false,
    thumbnailUrl: "https://via.placeholder.com/400x400.png?text=Art+Deco+Vase",
    modelUrl: "/uploads/models/sample.glb"
  },
  {
    title: "Utility Cable Organizer",
    description: "Modular cable management system with snap-fit connections and labeling options.",
    price: 799,
    category: "Utility",
    directPrintEnabled: true,
    thumbnailUrl: "https://via.placeholder.com/400x400.png?text=Cable+Organizer",
    modelUrl: "/uploads/models/sample.glb"
  },
  {
    title: "Utility Tool Holder",
    description: "Customizable wall-mounted tool organization system with adjustable holders.",
    price: 1999,
    category: "Utility",
    directPrintEnabled: true,
    thumbnailUrl: "https://via.placeholder.com/400x400.png?text=Tool+Holder",
    modelUrl: "/uploads/models/sample.glb"
  }
];

async function seedModels() {
  try {
    for (const model of models) {
      const response = await fetch('http://localhost:5000/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(model)
      });

      if (!response.ok) {
        throw new Error(`Failed to create model: ${model.title}`);
      }

      const result = await response.json();
      console.log(`Created model: ${result.title}`);
    }
    console.log('Successfully seeded all models');
  } catch (error) {
    console.error('Error seeding models:', error);
  }
}

seedModels();
