import useSWR from 'swr';
import type { Model } from '@/lib/types';
import { placeholderModels } from '@/lib/placeholder-data';

export function useModels() {
  const { data, error, mutate } = useSWR<Model[]>('/api/models');

  return {
    models: data || placeholderModels,
    isLoading: !error && !data,
    error,
    mutate
  };
}
