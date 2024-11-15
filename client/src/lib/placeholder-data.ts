import type { Model, ModelCategory } from "./types";

const generatePlaceholderImage = (width: number, height: number, text: string) => 
  `https://placehold.co/${width}x${height}/F4F4F5/71717A?text=${encodeURIComponent(text)}`;

export const placeholderModels: Model[] = [
  {
    id: 1,
    title: "Gaming Console Controller Stand",
    description: "A sleek and ergonomic stand for gaming controllers, featuring built-in cable management and charging dock compatibility.",
    price: 1499,
    thumbnailUrl: generatePlaceholderImage(400, 400, "Gaming+Controller+Stand"),
    modelUrl: "/models/controller-stand.glb",
    creatorId: 1,
    creatorName: "DesignMaster",
    category: "Gaming",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
    status: "active",
    fileSize: 2048576, // 2MB
    fileFormat: "glb",
    polygonCount: 24680,
    lastModified: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Mechanical Keyboard Case",
    description: "Custom mechanical keyboard case with adjustable typing angle and sound dampening features.",
    price: 3999,
    thumbnailUrl: generatePlaceholderImage(400, 400, "Mechanical+Keyboard"),
    modelUrl: "/models/keyboard-case.glb",
    creatorId: 2,
    creatorName: "TechDesigner",
    category: "Mechanical",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
    status: "active",
    fileSize: 3145728, // 3MB
    polygonCount: 45678,
    fileFormat: "glb",
    lastModified: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Abstract Sculpture - Waves",
    description: "Modern abstract sculpture featuring fluid wave patterns, perfect for contemporary spaces.",
    price: 4999,
    thumbnailUrl: generatePlaceholderImage(400, 400, "Abstract+Waves"),
    modelUrl: "/models/waves-sculpture.glb",
    creatorId: 3,
    creatorName: "ArtisticMind",
    category: "Art",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
    status: "active",
    fileSize: 4194304, // 4MB
    polygonCount: 67890,
    fileFormat: "glb",
    lastModified: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Utility Cable Organizer",
    description: "Modular cable management system with snap-fit connections and labeling options.",
    price: 799,
    thumbnailUrl: generatePlaceholderImage(400, 400, "Cable+Organizer"),
    modelUrl: "/models/cable-organizer.glb",
    creatorId: 4,
    creatorName: "UtilityPro",
    category: "Utility",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
    status: "active",
    fileSize: 1048576, // 1MB
    polygonCount: 12345,
    fileFormat: "glb",
    lastModified: new Date().toISOString(),
  }
];

export const categories: { id: ModelCategory; name: string; count: number }[] = [
  { id: "Gaming", name: "Gaming Models", count: 150 },
  { id: "Mechanical", name: "Mechanical Parts", count: 200 },
  { id: "Art", name: "Artistic Creations", count: 175 },
  { id: "Utility", name: "Utility Items", count: 125 }
];

export const collections = [
  { id: 1, name: "Popular This Week", count: 12 },
  { id: 2, name: "Editor's Choice", count: 8 },
  { id: 3, name: "New Arrivals", count: 24 },
  { id: 4, name: "Best Sellers", count: 16 }
];
