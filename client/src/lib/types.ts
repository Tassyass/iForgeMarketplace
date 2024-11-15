export interface Model {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  modelUrl: string;
  creatorId: number;
  creatorName: string;
  category: string;
  directPrintEnabled: boolean;
  createdAt: string;
}

export interface PrintOptions {
  material: string;
  color: string;
  size: number;
}

export interface DirectPrintOrder {
  modelId: number;
  userId: number;
  options: PrintOptions;
  status: 'pending' | 'printing' | 'completed';
}
