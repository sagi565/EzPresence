import { useState, useEffect, useCallback } from 'react';
import { Content, ContentOrigin } from '@models/Content';
import { api } from '@utils/apiClient';

// API Response matches MediaContentDto from OpenAPI spec
interface ApiMediaContent {
  uuid: string;
  title: string;
  thumbnail: string;
  favorite: boolean;
  origin: ContentOrigin;
  brandId?: number;
  listId?: number;
  contentType?: string;
  url?: string;
}

// Convert API media content to internal Content format
const convertApiContent = (apiContent: ApiMediaContent): Content => ({
  id: apiContent.uuid,
  title: apiContent.title,
  thumbnail: apiContent.thumbnail,
  favorite: apiContent.favorite,
  origin: apiContent.origin,
});

export const useMediaContents = (brandId: string) => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert brandId (uuid string) to numeric ID
  // Note: Your API expects numeric brandId, but Brand model uses uuid
  // You may need to store the numeric ID alongside the uuid
  const numericBrandId = brandId; // Adjust this conversion based on your data structure

  // Fetch content from API
  const fetchContent = useCallback(async () => {
    if (!brandId) return;

    try {
      setLoading(true);
      setError(null);
      
      // GET /api/media_contents/brand/{brandId}
      const response = await api.get<ApiMediaContent[]>(`/media_contents/brand/${numericBrandId}`);
      
      const convertedContent = response.map(convertApiContent);
      setContent(convertedContent);
    } catch (err: any) {
      console.error('Failed to fetch media contents:', err);
      setError(err.message || 'Failed to load content');
      
      // Fallback to empty array on error
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [brandId, numericBrandId]);

  // Fetch content when brandId changes
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (contentId: string) => {
    try {
      const contentItem = content.find(c => c.id === contentId);
      if (!contentItem) return;

      // PUT /api/media_contents/{uuid}
      await api.put(`/media_contents/${contentId}`, {
        favorite: !contentItem.favorite,
      });

      setContent(prev => prev.map(c => 
        c.id === contentId ? { ...c, favorite: !c.favorite } : c
      ));
    } catch (err: any) {
      console.error('Failed to toggle favorite:', err);
      throw err;
    }
  }, [content]);

  // Create new content
  const createContent = useCallback(async (contentData: {
    title: string;
    thumbnail: string;
    favorite: boolean;
    origin: ContentOrigin;
    listId?: number;
    contentType?: string;
    url?: string;
  }) => {
    try {
      // POST /api/media_contents
      const uuid = await api.post<string>('/media_contents', contentData);
      
      // Fetch the created content
      const newContent = await api.get<ApiMediaContent>(`/media_contents/${uuid}`);
      const converted = convertApiContent(newContent);
      
      setContent(prev => [...prev, converted]);
      return converted;
    } catch (err: any) {
      console.error('Failed to create content:', err);
      throw err;
    }
  }, []);

  // Delete content
  const deleteContent = useCallback(async (contentId: string) => {
    try {
      // DELETE /api/media_contents/{uuid}
      await api.delete(`/media_contents/${contentId}`);
      setContent(prev => prev.filter(c => c.id !== contentId));
    } catch (err: any) {
      console.error('Failed to delete content:', err);
      throw err;
    }
  }, []);

  // Move content to another list
  const moveContent = useCallback(async (contentId: string, targetListId: number) => {
    try {
      // PUT /api/media_contents/{uuid}/move/{targetListId}
      await api.put(`/media_contents/${contentId}/move/${targetListId}`);
      
      // Optionally refetch or update local state
      await fetchContent();
    } catch (err: any) {
      console.error('Failed to move content:', err);
      throw err;
    }
  }, [fetchContent]);

  return {
    content,
    loading,
    error,
    refetchContent: fetchContent,
    toggleFavorite,
    createContent,
    deleteContent,
    moveContent,
  };
};