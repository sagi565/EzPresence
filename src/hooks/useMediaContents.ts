import { useState, useEffect, useCallback } from 'react';
import { 
  Content, 
  ContentOrigin,
  ApiMediaContentDto,
  ApiMediaContentCreateDto,
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
      
      // Note: The API spec doesn't show a media_contents endpoint with brand filtering
      // You may need to adjust this endpoint based on your actual API
      // GET /api/media_contents/brand/{brandId} or similar
      const response = await api.get<ApiMediaContentDto[]>(`/media_contents`);
      
      if (!response || !Array.isArray(response)) {
        setContent([]);
        return;
      }
      
      const convertedContent = response.map(convertApiMediaContentToContent);
      setContent(convertedContent);
    } catch (err: any) {
      console.error('Failed to fetch media contents:', err);
      setError(err.message || 'Failed to load content');
      setContent([]);
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

      // Note: The API spec shows MediaContentUpdateDto only has contentName
      // If you need to update favorite status, you may need a different endpoint
      // For now, we'll update locally
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

      // Note: The API spec doesn't show a POST endpoint for media_contents
      // You may need to adjust this based on your actual API
      const uuid = await api.post<string>('/media_contents', apiData);
      
      // Fetch the created content
      const newContent = await api.get<ApiMediaContentDto>(`/media_contents/${uuid}`);
      const converted = convertApiMediaContentToContent(newContent);
      
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
      // Note: The API spec doesn't show a DELETE endpoint for media_contents
      // You may need to adjust this based on your actual API
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
      // Note: The API spec doesn't show a move endpoint
      // You may need to adjust this based on your actual API
      await api.put(`/media_contents/${contentId}`, { listId: targetListId });
      await fetchContent();
    } catch (err: any) {
      console.error('Failed to move content:', err);
      throw err;
    }
  }, [fetchContent]);

  // Rename content
  const renameContent = useCallback(async (contentId: string, newName: string) => {
    try {
      // PUT using MediaContentUpdateDto
      await api.put(`/media_contents/${contentId}`, { contentName: newName });
      
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