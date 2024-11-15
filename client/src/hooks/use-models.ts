import useSWR from 'swr';
import type { Model } from '@/lib/types';

export function useModels() {
  const { data, error, mutate } = useSWR<Model[]>('/api/models');

  return {
    models: data,
    isLoading: !error && !data,
    error,
    mutate
  };
}
