import { useState, useCallback, useEffect } from 'react';
import {
  ContentList,
  ApiContentListDto,
  ApiContentListCreateDto,
  convertApiContentListToContentList,
} from '@models/ContentList';
import { ApiMediaContentDto } from '@models/Content';
import { api } from '@utils/apiClient';
import { calculateChecksum, generateThumbnail } from '@utils/fileUtils';

interface PresignedUrlResponse {
  type: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  expiresAt: string;
}

// FIX: Added 'brandId' optional parameter here to solve "Expected 0 arguments" error
export const useContentLists = (brandId?: string) => {
  const [lists, setLists] = useState<ContentList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newlyCreatedListId, setNewlyCreatedListId] = useState<string | null>(null);

  const clearNewListFlag = useCallback(() => {
    setNewlyCreatedListId(null);
  }, []);

  const fetchLists = useCallback(async () => {
    // If brandId is provided but empty, or if we are in a context where we need a brand but don't have it
    if (brandId === '') {
      setLists([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Lists
      const listsResponse = await api.get<ApiContentListDto[]>('/contentlists');

      if (!Array.isArray(listsResponse)) {
        setLists([]);
        return;
      }

      const convertedLists = listsResponse.map(convertApiContentListToContentList);
      convertedLists.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      // 2. Fetch Content (Backend filters by the Active Brand set in session)
      const allContentsResponse = await api.get<ApiMediaContentDto[]>('/contents?count=100');

      if (Array.isArray(allContentsResponse)) {
        convertedLists.forEach(list => {
          list.items = allContentsResponse
            .filter((c) => c.listUuid === list.id)
            .map((c) => {
              const mediaType = (c.mediaType || '').toLowerCase();
              const fileName = (c.contentName || '').toLowerCase();
              const isVideo = mediaType.includes('video') || fileName.match(/\.(mp4|mov|avi|webm|mkv)$/);

              return {
                id: c.uuid,
                type: isVideo ? 'video' : 'image',
                title: c.contentName || 'Untitled',
                thumbnail: c.thumbnailObject || '',
                favorite: c.isFavorite || false,
                status: 'success',
                createdAt: c.createdAt
              };
            });
        });
      }

      setLists(convertedLists);
    } catch (err: any) {
      console.error('Failed to fetch lists:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [brandId]); // Dependency ensures refresh when brandId changes

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  // --- CRUD Operations ---

  const addNewList = useCallback(async () => {
    try {
      const tempListId = `temp-${Date.now()}`;
      const newList: ContentList = {
        id: tempListId,
        title: 'New List',
        icon: '📁',
        isSystem: false,
        items: [],
        listType: 'image',
        orderIndex: lists.length
      };
      setLists(prev => [...prev, newList]);
      setNewlyCreatedListId(tempListId);

      const payload: ApiContentListCreateDto = {
        listName: 'New List',
        listIcon: '📁'
      };

      const newListUuid = await api.post<string>('/contentlists', payload);
      setLists(prev => prev.map(l => l.id === tempListId ? { ...l, id: newListUuid } : l));
      setNewlyCreatedListId(newListUuid);

    } catch (err) {
      console.error("Failed to create list", err);
      await fetchLists();
    }
  }, [lists.length, fetchLists]);

  const deleteList = useCallback(async (listId: string) => {
    try {
      setLists(prev => prev.filter(l => l.id !== listId));
      await api.delete(`/contentlists/${listId}`);
    } catch (err) {
      console.error("Failed to delete list", err);
      await fetchLists();
    }
  }, [fetchLists]);

  const updateListTitle = useCallback(async (listId: string, newTitle: string) => {
    try {
      setLists(prev => prev.map(l => l.id === listId ? { ...l, title: newTitle } : l));
      await api.put(`/contentlists/${listId}`, {
        updatedProperties: { ListName: newTitle }
      });
    } catch (err) {
      console.error("Failed to update title", err);
    }
  }, []);

  const updateListIcon = useCallback(async (listId: string, newIcon: string) => {
    try {
      setLists(prev => prev.map(l => l.id === listId ? { ...l, icon: newIcon } : l));
      await api.put(`/contentlists/${listId}`, {
        updatedProperties: { ListIcon: newIcon }
      });
    } catch (err) {
      console.error("Failed to update icon", err);
    }
  }, []);

  const getNewListId = useCallback(() => {
    return lists.length > 0 ? lists[lists.length - 1].id : null;
  }, [lists]);

  const moveItem = useCallback(async (itemId: string, sourceListId: string, targetListId: string) => {
    try {
      setLists(prevLists => {
        const newLists = prevLists.map(l => ({ ...l, items: [...l.items] }));
        const sourceListIndex = newLists.findIndex(l => l.id === sourceListId);
        const targetListIndex = newLists.findIndex(l => l.id === targetListId);

        if (sourceListIndex === -1 || targetListIndex === -1) return prevLists;

        const sourceList = newLists[sourceListIndex];
        const itemIndex = sourceList.items.findIndex(i => i.id === itemId);

        if (itemIndex === -1) return prevLists;

        const [movedItem] = sourceList.items.splice(itemIndex, 1);
        newLists[targetListIndex].items.unshift(movedItem);

        return newLists;
      });

      await api.put(`/contents/${itemId}/list/${targetListId}`);
    } catch (err) {
      console.error("Failed to move item", err);
      await fetchLists();
    }
  }, [fetchLists]);

  const deleteItem = useCallback(async (itemId: string, listId: string) => {
    try {
      setLists(prev => prev.map(list => {
        if (list.id === listId) {
          return { ...list, items: list.items.filter(i => i.id !== itemId) };
        }
        return list;
      }));
      await api.delete(`/contents/${itemId}`);
    } catch (err) {
      console.error("Failed to delete item", err);
      await fetchLists();
    }
  }, [fetchLists]);

  const toggleFavorite = useCallback(async (itemId: string, listId: string) => {
    try {
      setLists(prevLists => prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, favorite: !item.favorite } : item
            )
          };
        }
        return list;
      }));
      await api.put(`/contents/${itemId}/favorite`);
    } catch (err: any) {
      console.error('Failed to toggle favorite:', err);
    }
  }, []);

  const uploadContent = useCallback(async (listId: string, file: File) => {
    const tempId = `temp-${Date.now()}`;
    const thumbnailDataUrl = await generateThumbnail(file);
    const isVideo = file.type.startsWith('video/');

    setLists(prevLists => prevLists.map(list => {
      if (list.id === listId) {
        const newItem: any = {
          id: tempId,
          type: isVideo ? 'video' : 'image',
          title: file.name,
          thumbnail: thumbnailDataUrl,
          status: 'uploading',
          favorite: false,
          createdAt: new Date().toISOString()
        };
        return {
          ...list,
          items: [newItem, ...list.items] as any
        };
      }
      return list;
    }));

    try {
      const checksum = await calculateChecksum(file);
      const contentId = await api.post<string>('/contents', {
        listUuid: listId,
        contentName: file.name,
        isEzGenerated: false,
        checksumSha256: checksum
      });

      const presignedData = await api.get<PresignedUrlResponse>(`/storage/${contentId}/upload-url`);
      if (!presignedData?.url) throw new Error("No upload URL");

      const apiHeaders = presignedData.headers || {};
      const cleanHeaders: Record<string, string> = {};
      const typeKey = Object.keys(apiHeaders).find(k => k.toLowerCase() === 'content-type');
      const finalType = typeKey ? apiHeaders[typeKey] : file.type;

      Object.keys(apiHeaders).forEach(key => {
        if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'content-type') {
          cleanHeaders[key] = apiHeaders[key];
        }
      });

      await fetch(presignedData.url, {
        method: presignedData.method || 'PUT',
        body: file,
        headers: { ...cleanHeaders, 'Content-Type': finalType },
        mode: 'cors'
      });

      const base64Raw = thumbnailDataUrl.includes(',') ? thumbnailDataUrl.split(',')[1] : thumbnailDataUrl;
      await api.post(`/storage/${contentId}/upload/complete`, { thumbnailObject: base64Raw });

      await fetchLists();
    } catch (err: any) {
      console.error('Upload error:', err);
      setLists(prevLists => prevLists.map(list => {
        if (list.id === listId) {
          return { ...list, items: list.items.filter(i => i.id !== tempId) };
        }
        return list;
      }));
      throw err;
    }
  }, [fetchLists]);

  const renameItem = useCallback(async (itemId: string, listId: string, newName: string) => {
    try {
      setLists(prev => prev.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            items: l.items.map(i => i.id === itemId ? { ...i, title: newName } : i)
          };
        }
        return l;
      }));
      // Assuming API structure for content update
      await api.put(`/contents/${itemId}`, {
        contentName: newName
      });
    } catch (err) {
      console.error("Failed to rename item", err);
      await fetchLists();
    }
  }, [fetchLists]);

  const reorderLists = useCallback(async (startIndex: number, endIndex: number) => {
    try {
      setLists(prevLists => {
        const result = Array.from(prevLists);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        // Update orderIndex
        const updatedLists = result.map((list, index) => ({
          ...list,
          orderIndex: index
        }));

        // Send new order to server
        const orderPayload = updatedLists.map(l => l.id);
        // Using a fire-and-forget update or assuming generic update endpoint
        api.put('/contentlists/reorder', { orderedListUuids: orderPayload })
          .catch(err => console.error("Failed to reorder lists on server", err));

        return updatedLists;
      });
    } catch (err) {
      console.error("Failed to reorder lists", err);
    }
  }, []);

  return {
    lists, loading, error, addNewList, deleteList, updateListTitle,
    updateListIcon, getNewListId, moveItem, deleteItem, toggleFavorite, uploadContent,
    reorderLists, renameItem, newlyCreatedListId, clearNewListFlag
  };
};