import useSWR from 'swr';
import type { Model, ValidationResult } from '@/lib/types';
import { placeholderModels } from '@/lib/placeholder-data';

// Validation function for model data
function validateModel(data: any): ValidationResult<Model> {
  const errors: string[] = [];
  
  if (!data) {
    return { isValid: false, errors: ['Model data is missing'] };
  }

  // Required fields validation
  const requiredFields = ['id', 'title', 'description', 'price', 'creatorId', 'creatorName', 'category'];
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Type validations
  if (typeof data.id !== 'number') errors.push('Invalid id type');
  if (typeof data.title !== 'string') errors.push('Invalid title type');
  if (typeof data.description !== 'string') errors.push('Invalid description type');
  if (typeof data.price !== 'number' || data.price < 0) errors.push('Invalid price');
  if (typeof data.directPrintEnabled !== 'boolean') errors.push('Invalid directPrintEnabled type');

  // URL validations
  try {
    if (data.thumbnailUrl) new URL(data.thumbnailUrl);
    if (data.modelUrl) new URL(data.modelUrl);
  } catch {
    errors.push('Invalid URL format');
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? data as Model : undefined,
    errors: errors.length > 0 ? errors : undefined
  };
}

function validateModelArray(data: any[]): ValidationResult<Model[]> {
  if (!Array.isArray(data)) {
    return { isValid: false, errors: ['Data is not an array'] };
  }

  const validatedModels: Model[] = [];
  const errors: string[] = [];

  data.forEach((item, index) => {
    const result = validateModel(item);
    if (result.isValid && result.data) {
      validatedModels.push(result.data);
    } else {
      errors.push(`Model at index ${index} is invalid: ${result.errors?.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    data: validatedModels,
    errors: errors.length > 0 ? errors : undefined
  };
}

export function useModels() {
  const { data, error, isLoading, mutate } = useSWR<any[]>('/api/models', {
    fallbackData: placeholderModels,
    revalidateOnMount: true,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 3 times
      if (retryCount >= 3) return;
      // Retry after 5 seconds
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  const validationResult = data ? validateModelArray(data) : { isValid: true, data: placeholderModels };

  return {
    models: validationResult.isValid ? validationResult.data : placeholderModels,
    isLoading,
    isError: error || !validationResult.isValid,
    validationErrors: validationResult.errors,
    mutate
  };
}
