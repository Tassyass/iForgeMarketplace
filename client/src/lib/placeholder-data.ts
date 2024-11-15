import type { Model, ModelCategory } from "./types";

const generatePlaceholderImage = (width: number, height: number, text: string) => 
  `https://placehold.co/${width}x${height}/F4F4F5/71717A?text=${encodeURIComponent(text)}`;

export const placeholderModels: Model[] = [
  {
    id: 1,
    title: "Geometric Desk Organizer",
    description: "A modern desk organizer with geometric patterns perfect for any workspace. Features multiple compartments and a sleek design.",
    price: 1499,
    thumbnailUrl: generatePlaceholderImage(400, 400, "Desk Organizer"),
    modelUrl: "/models/desk-organizer.glb",
    creatorId: 1,
    creatorName: "DesignMaster",
    category: "Utility",
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
    title: "Dragon Miniature",
    description: "Highly detailed dragon miniature perfect for gaming and display. Features intricate scales and dynamic pose.",
    price: 2499,
    thumbnailUrl: generatePlaceholderImage(400, 400, "Dragon"),
    modelUrl: "/models/dragon.glb",
    creatorId: 2,
    creatorName: "GameArtist",
    category: "Gaming",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
    status: "active",
    fileSize: 3145728, // 3MB
    fileFormat: "glb",
    polygonCount: 45678,
    lastModified: new Date().toISOString(),
  },
  // Add more models with complete data...
];

export const categories: { id: ModelCategory; name: string; count: number }[] = [
  { id: "Gaming", name: "Gaming Models", count: 2500 },
  { id: "Mechanical", name: "Mechanical Parts", count: 1800 },
  { id: "Art", name: "Artistic Creations", count: 3200 },
  { id: "Utility", name: "Utility Items", count: 1500 },
];

export const collections = [
  { id: 1, name: "Popular This Week", count: 12 },
  { id: 2, name: "Editor's Choice", count: 8 },
  { id: 3, name: "New Arrivals", count: 24 },
  { id: 4, name: "Best Sellers", count: 16 },
];