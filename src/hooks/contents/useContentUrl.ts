import { useState, useCallback } from 'react';
import { api } from '@utils/apiClient';

export const useContentUrl = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUrl = useCallback(async (contentId: string) => {
    // Return cached url if available
    if (url) return;

    try {
      setLoading(true);
      // We use 'any' here to inspect the response structure dynamically
      const response = await api.get<any>(`/storage/${contentId}/download-url`);
      
      // Handle different response formats
      let downloadUrl = null;

      if (typeof response === 'string') {
        // Case 1: API returns raw URL string
        downloadUrl = response;
      } else if (response && typeof response === 'object') {
        // Case 2: API returns JSON object { url: "..." }
        downloadUrl = response.url || response.downloadUrl;
      }

      if (downloadUrl && downloadUrl.startsWith('http')) {
        setUrl(downloadUrl);
      } else {
        console.warn('Invalid download URL received:', response);
      }
    } catch (err) {
      console.error('Failed to fetch content URL:', err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { url, loading, fetchUrl };
};