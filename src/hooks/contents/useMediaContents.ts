import { useState, useCallback, useEffect } from 'react';
import { ApiMediaContentDto, convertApiMediaContentToContent, Content } from '@models/Content';
import { api } from '@utils/apiClient';

export const useMediaContents = (brandId: string | undefined) => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!brandId) {
      setContent([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch contents for the ACTIVE brand (set via session in useBrands)
      const response = await api.get<ApiMediaContentDto[]>('/contents?count=100');

      if (Array.isArray(response)) {
        const mappedContent = response.map(convertApiMediaContentToContent).map(c => ({
            ...c,
            // Ensure we catch the thumbnail object
            thumbnail: c.thumbnail || '' 
        }));
        setContent(mappedContent);
      } else {
        setContent([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch media contents:', err);
      setError(err.message);
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [brandId]); // Dependency on brandId ensures refetch on switch

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent
  };
};