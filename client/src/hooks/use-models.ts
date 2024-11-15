import useSWR from 'swr';
import type { Model, ValidationResult } from '@/lib/types';
import { placeholderModels } from '@/lib/placeholder-data';

// Cache validation results to avoid redundant validation
const validationCache = new Map<string, ValidationResult<Model>>();

// Validation function for model data with caching
function validateModel(data: any, cacheKey?: string): ValidationResult<Model> {
  if (cacheKey && validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey)!;
  }

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

  // Type validations with improved error messages
  if (typeof data.id !== 'number') errors.push('Invalid id type: expected number');
  if (typeof data.title !== 'string') errors.push('Invalid title type: expected string');
  if (typeof data.description !== 'string') errors.push('Invalid description type: expected string');
  if (typeof data.price !== 'number' || data.price < 0) errors.push('Invalid price: must be a positive number');
  if (typeof data.directPrintEnabled !== 'boolean') errors.push('Invalid directPrintEnabled type: expected boolean');

  // URL validations with better error handling
  try {
    if (data.thumbnailUrl) new URL(data.thumbnailUrl);
    if (data.modelUrl) new URL(data.modelUrl);
  } catch {
    errors.push('Invalid URL format for thumbnailUrl or modelUrl');
  }

  const result = {
    isValid: errors.length === 0,
    data: errors.length === 0 ? data as Model : undefined,
    errors: errors.length > 0 ? errors : undefined
  };

  if (cacheKey) {
    validationCache.set(cacheKey, result);
  }

  return result;
}

function validateModelArray(data: any[]): ValidationResult<Model[]> {
  if (!Array.isArray(data)) {
    return { isValid: false, errors: ['Data is not an array'] };
  }

  const validatedModels: Model[] = [];
  const errors: string[] = [];

  data.forEach((item, index) => {
    const result = validateModel(item, `model-${item?.id || index}`);
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

export function useModels(category?: string) {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    '/api/models',
    {
      fallbackData: placeholderModels,
      revalidateOnMount: true,
      revalidateIfStale: false,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 3 times and not on 404s
        if (retryCount >= 3 || error.status === 404) return;
        // Exponential backoff
        setTimeout(() => revalidate({ retryCount }), Math.min(1000 * 2 ** retryCount, 30000));
      },
    }
  );

  const validationResult = data ? validateModelArray(data) : { isValid: true, data: placeholderModels };
  
  // Filter models by category if provided
  const filteredModels = category && validationResult.data
    ? validationResult.data.filter(model => 
        model.category.toLowerCase() === category.toLowerCase()
      )
    : validationResult.data;

  return {
    models: filteredModels || placeholderModels,
    isLoading,
    isError: error || !validationResult.isValid,
    validationErrors: validationResult.errors,
    mutate
  };
}
