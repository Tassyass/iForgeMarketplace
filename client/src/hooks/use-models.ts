import useSWR from 'swr';
import type { Model } from '@/lib/types';
import { placeholderModels } from '@/lib/placeholder-data';

export function useModels() {
  const { data, error, isLoading, mutate } = useSWR<Model[]>('/api/models', {
    fallbackData: placeholderModels,
    revalidateOnMount: true,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 3 times
      if (retryCount >= 3) return;
      // Retry after 5 seconds
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  return {
    models: error ? placeholderModels : data,
    isLoading,
    isError: error,
    mutate
  };
}
