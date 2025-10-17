import { useState, useCallback } from 'react';
import { ContentList, ContentItem, SYSTEM_LISTS } from '@models/ContentList';

const CUSTOM_LIST_EMOJIS = [
  '🎨', '🚀', '✨', '🔥', '💡', 
  '🎯', '🌟', '💫', '🎪', '🎭',
  '🎸', '🎮', '🍕', '🌈', '⚡',
  '🦄', '🎉', '💎', '🏆', '🌺'
];

export const useContentLists = () => {
  const [lists, setLists] = useState<ContentList[]>(SYSTEM_LISTS);
  const [listCounter, setListCounter] = useState(1);

  const addNewList = useCallback(() => {
    const randomEmoji = CUSTOM_LIST_EMOJIS[Math.floor(Math.random() * CUSTOM_LIST_EMOJIS.length)];
    const newList: ContentList = {
      id: `custom-list-${listCounter}`,
      icon: randomEmoji,
      title: 'My new playlist',
      isSystem: false,
      listType: 'video',
      items: [],
    };
    
    setLists(prev => [...prev, newList]);
    setListCounter(prev => prev + 1);
  }, [listCounter]);

  const deleteList = useCallback((listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  }, []);

  const updateListTitle = useCallback((listId: string, newTitle: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, title: newTitle } : list
    ));
  }, []);

  const updateListIcon = useCallback((listId: string, newIcon: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, icon: newIcon } : list
    ));
  }, []);

  const moveItem = useCallback((itemId: string, fromListId: string, toListId: string) => {
    setLists(prev => {
      const fromList = prev.find(l => l.id === fromListId);
      const toList = prev.find(l => l.id === toListId);
      
      if (!fromList || !toList) return prev;
      
      const item = fromList.items.find(i => i.id === itemId);
      if (!item) return prev;
      
      // Type check: videos can only go to video lists, images to image lists
      if ((item.type === 'video' && toList.listType === 'image') ||
          (item.type === 'image' && toList.listType === 'video')) {
        return prev;
      }
      
      return prev.map(list => {
        if (list.id === fromListId) {
          return { ...list, items: list.items.filter(i => i.id !== itemId) };
        }
        if (list.id === toListId) {
          return { ...list, items: [...list.items, item] };
        }
        return list;
      });
    });
  }, []);

  const deleteItem = useCallback((itemId: string, listId: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, items: list.items.filter(i => i.id !== itemId) }
        : list
    ));
  }, []);

  const toggleFavorite = useCallback((itemId: string, listId: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId
                ? { ...item, favorite: !item.favorite }
                : item
            ),
          }
        : list
    ));
  }, []);

  const uploadContent = useCallback((listId: string, file: File) => {
    // Mock upload functionality
    const isVideo = file.type.startsWith('video/');
    const emoji = isVideo ? '🎬' : '📷';
    const title = file.name.replace(/\.[^/.]+$/, '');
    
    const newItem: ContentItem = {
      id: `uploaded-${Date.now()}`,
      type: isVideo ? 'video' : 'image',
      title,
      date: new Date().toLocaleDateString(),
      thumbnail: emoji,
    };
    
    setLists(prev => prev.map(list =>
      list.id === listId
        ? { ...list, items: [newItem, ...list.items] }
        : list
    ));
  }, []);

  return {
    lists,
    addNewList,
    deleteList,
    updateListTitle,
    updateListIcon,
    moveItem,
    deleteItem,
    toggleFavorite,
    uploadContent,
  };
};