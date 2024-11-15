import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';

export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParamsState] = useState<URLSearchParams>(() => {
    return new URLSearchParams(location.split('?')[1] || '');
  });

  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.split('?')[1] || '');
    setSearchParamsState(newSearchParams);
  }, [location]);

  const setSearchParams = useCallback((params: URLSearchParams) => {
    const newSearch = params.toString();
    setLocation(`${location.split('?')[0]}${newSearch ? `?${newSearch}` : ''}`);
  }, [location, setLocation]);

  return [searchParams, setSearchParams];
}
