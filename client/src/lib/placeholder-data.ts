import type { Model } from "./types";

export const placeholderModels: Model[] = [
  {
    id: 1,
    title: "Geometric Desk Organizer",
    description: "A modern desk organizer with geometric patterns perfect for any workspace.",
    price: 1499,
    thumbnailUrl: "https://picsum.photos/seed/model1/400",
    modelUrl: "/models/desk-organizer.glb",
    creatorId: 1,
    creatorName: "DesignMaster",
    category: "Utility",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Dragon Miniature",
    description: "Highly detailed dragon miniature perfect for gaming and display.",
    price: 2499,
    thumbnailUrl: "https://picsum.photos/seed/model2/400",
    modelUrl: "/models/dragon.glb",
    creatorId: 2,
    creatorName: "GameArtist",
    category: "Gaming",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Mechanical Keyboard Case",
    description: "Custom mechanical keyboard case with modern aesthetics.",
    price: 3999,
    thumbnailUrl: "https://picsum.photos/seed/model3/400",
    modelUrl: "/models/keyboard-case.glb",
    creatorId: 3,
    creatorName: "TechMaker",
    category: "Mechanical",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Abstract Vase",
    description: "Beautiful abstract vase with unique patterns.",
    price: 1999,
    thumbnailUrl: "https://picsum.photos/seed/model4/400",
    modelUrl: "/models/vase.glb",
    creatorId: 4,
    creatorName: "ArtisticSoul",
    category: "Art",
    directPrintEnabled: true,
    createdAt: new Date().toISOString(),
  },
];

export const categories = [
  { id: "gaming", name: "Gaming", count: 2500 },
  { id: "mechanical", name: "Mechanical", count: 1800 },
  { id: "art", name: "Art", count: 3200 },
  { id: "utility", name: "Utility", count: 1500 },
];

export const collections = [
  { id: 1, name: "Popular This Week", count: 12 },
  { id: 2, name: "Editor's Choice", count: 8 },
  { id: 3, name: "New Arrivals", count: 24 },
  { id: 4, name: "Best Sellers", count: 16 },
];
