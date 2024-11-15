// Model related types
export interface Model {
  id: number;
  title: string;
  description: string;
  price: number; // Price in cents
  thumbnailUrl: string;
  modelUrl: string;
  creatorId: number;
  creatorName: string;
  category: ModelCategory;
  directPrintEnabled: boolean;
  createdAt: string;
  status?: ModelStatus;
  fileSize?: number; // Size in bytes
  fileFormat?: string; // e.g., 'glb', 'stl'
  polygonCount?: number;
  lastModified?: string;
}

export type ModelCategory = 'Gaming' | 'Mechanical' | 'Art' | 'Utility';

export type ModelStatus = 'active' | 'draft' | 'archived' | 'processing';

export interface PrintOptions {
  material: PrintMaterial;
  color: PrintColor;
  size: number; // Percentage of original size
  quality?: PrintQuality;
  infill?: number; // Percentage (0-100)
  supports?: boolean;
}

export type PrintMaterial = 'PLA' | 'ABS' | 'PETG' | 'TPU' | 'Nylon';
export type PrintColor = 'white' | 'black' | 'gray' | 'red' | 'blue' | 'green' | 'yellow';
export type PrintQuality = 'draft' | 'normal' | 'high' | 'ultra';

export interface DirectPrintOrder {
  modelId: number;
  userId: number;
  options: PrintOptions;
  status: PrintOrderStatus;
  createdAt: string;
  estimatedPrintTime?: number; // In minutes
  materialUsage?: number; // In grams
  cost?: number; // In cents
}

export type PrintOrderStatus = 'pending' | 'approved' | 'printing' | 'completed' | 'failed' | 'cancelled';

// Validation helper type
export type ValidationResult<T> = {
  isValid: boolean;
  data?: T;
  errors?: string[];
};
