import { useState, useEffect, useCallback } from 'react';
import { 
  Content, 
  ApiMediaContentDto,
  convertApiMediaContentToContent,
  convertContentToApiCreate
} from '@models/Content';
import { api } from '@utils/apiClient';

export const useMediaContents = (brandId: string) => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content from API
  const fetchContent = useCallback(async () => {
    if (!brandId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fixed: Using the correct endpoint pattern for brand-specific contents
      // GET /api/brands/{brandId}/contents
      const response = await api.get<ApiMediaContentDto[]>(`/brands/${brandId}/contents`);
      
      if (!response || !Array.isArray(response)) {
        setContent([]);
        return;
      }
      
      const convertedContent = response.map(convertApiMediaContentToContent);
      setContent(convertedContent);
    } catch (err: any) {
      console.error('Failed to fetch media contents:', err);
      // Gracefully handle 404 if the brand has no contents yet (or if endpoint is still wrong)
      if (err.status === 404) {
         setContent([]);
      } else {
         setError(err.message || 'Failed to load content');
      }
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  // Fetch content when brandId changes
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (contentId: string) => {
    try {
      const contentItem = content.find(c => c.id === contentId);
      if (!contentItem) return;

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
    mediaType: 'video' | 'image';
    filePath?: string;
    listId?: number;
    favorite?: boolean;
    isEzGenerated?: boolean;
    sizeBytes?: number;
    durationSec?: number;
  }): Promise<Content> => {
    try {
      const apiData = convertContentToApiCreate(contentData);

      // Assumed endpoint: POST /api/brands/{brandId}/contents
      // Note: You might need to update this to the correct creation endpoint if it's different
      const uuid = await api.post<string>(`/brands/${brandId}/contents`, apiData);
      
      // Fetch the created content
      // GET /api/contents/{id} (assuming individual retrieval is global or nested)
      const newContent = await api.get<ApiMediaContentDto>(`/contents/${uuid}`);
      const converted = convertApiMediaContentToContent(newContent);
      
      setContent(prev => [...prev, converted]);
      return converted;
    } catch (err: any) {
      console.error('Failed to create content:', err);
      throw err;
    }
  }, [brandId]);

  // Delete content
  const deleteContent = useCallback(async (contentId: string) => {
    try {
      await api.delete(`/contents/${contentId}`);
      setContent(prev => prev.filter(c => c.id !== contentId));
    } catch (err: any) {
      console.error('Failed to delete content:', err);
      throw err;
    }
  }, []);

  // Move content to another list
  const moveContent = useCallback(async (contentId: string, targetListId: number) => {
    try {
      await api.put(`/contents/${contentId}`, { listId: targetListId });
      await fetchContent();
    } catch (err: any) {
      console.error('Failed to move content:', err);
      throw err;
    }
  }, [fetchContent]);

  // Rename content
  const renameContent = useCallback(async (contentId: string, newName: string) => {
    try {
      await api.put(`/contents/${contentId}`, { contentName: newName });
      
      setContent(prev => prev.map(c => 
        c.id === contentId ? { ...c, title: newName } : c
      ));
    } catch (err: any) {
      console.error('Failed to rename content:', err);
      throw err;
    }
  }, []);

  return {
    content,
    loading,
    error,
    refetchContent: fetchContent,
    toggleFavorite,
    createContent,
    deleteContent,
    moveContent,
    renameContent,
  };
};