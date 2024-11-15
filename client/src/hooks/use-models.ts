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

  // Required fields validation with specific error messages
  const requiredFields = [
    { field: 'id', type: 'number' },
    { field: 'title', type: 'string' },
    { field: 'description', type: 'string' },
    { field: 'price', type: 'number' },
    { field: 'creatorId', type: 'number' },
    { field: 'creatorName', type: 'string' },
    { field: 'category', type: 'string' }
  ];

  requiredFields.forEach(({ field, type }) => {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof data[field] !== type) {
      errors.push(`Invalid ${field} type: expected ${type}`);
    }
  });

  // Additional validations
  if (data.price !== undefined && (data.price < 0 || !Number.isFinite(data.price))) {
    errors.push('Invalid price: must be a positive number');
  }

  if (typeof data.directPrintEnabled !== 'boolean') {
    errors.push('Invalid directPrintEnabled type: expected boolean');
  }

  // URL validations with better error handling
  ['thumbnailUrl', 'modelUrl'].forEach(field => {
    if (data[field]) {
      try {
        new URL(data[field]);
      } catch {
        errors.push(`Invalid URL format for ${field}`);
      }
    }
  });

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
      revalidateIfStale: true,
      dedupingInterval: 10000, // 10 seconds
      errorRetryCount: 3,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Don't retry on 404s or server errors
        if (error.status === 404 || error.status >= 500) return;
        
        // Only retry up to 3 times
        if (retryCount >= 3) return;
        
        // Exponential backoff
        setTimeout(() => revalidate({ retryCount }), Math.min(1000 * 2 ** retryCount, 30000));
      },
    }
  );

  // Validate data and handle errors gracefully
  const validationResult = data 
    ? validateModelArray(data)
    : { isValid: true, data: placeholderModels };
  
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
    error: error ? error.message : validationResult.errors?.join(', '),
    mutate
  };
}
