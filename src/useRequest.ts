import { useState, useCallback, useRef, useMemo } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface UseRequestProps {
  body?: any;
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch';
}

export const useRequest = <T>({ url, method = 'get', body }: UseRequestProps) => {
  const cache = useRef(new Map());
  const cacheKey = useMemo(() => {
    return method + url;
  }, [url, method]);

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = useCallback(async () => {
    if (cache.current.has(cacheKey)) {
      setData(cache.current.get(cacheKey));
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response: AxiosResponse<T> = await axios[method](url, body);
      cache.current.set(cacheKey, response.data);
      setData(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [body, method, url, cacheKey]);

  const refetchData = useCallback(() => {
    cache.current.delete(url);
    fetchData();
  }, [url, fetchData]);

  return { data, isLoading, error, fetchData, refetchData };
};
