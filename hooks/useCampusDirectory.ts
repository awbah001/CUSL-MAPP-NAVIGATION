import { useCallback, useEffect, useState } from 'react';

import { fetchCampusDirectory, type LiveCategory, type LivePlace } from '@/data/live';

export function useCampusDirectory() {
  const [places, setPlaces] = useState<LivePlace[]>([]);
  const [categories, setCategories] = useState<LiveCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const directory = await fetchCampusDirectory();
      setPlaces(directory.places);
      setCategories(directory.categories);
    } catch (cause) {
      setPlaces([]);
      setCategories([]);
      setError(cause instanceof Error ? cause.message : 'Could not load campus places.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { places, categories, loading, error, reload };
}
