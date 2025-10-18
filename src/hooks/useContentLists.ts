import { useState, useCallback, useRef } from 'react';

interface ContentItem {
  id: string;
  type: 'video' | 'image' | 'upload';
  title?: string;
  date?: string;
  thumbnail: string;
  favorite?: boolean;
}

interface ContentList {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  isSystem: boolean;
  listType: 'video' | 'image';
  items: ContentItem[];
}

const SYSTEM_LISTS: ContentList[] = [
  {
    id: 'my-videos',
    icon: '🎹',
    title: 'My Videos',
    subtitle: 'Uploaded from your PC',
    isSystem: true,
    listType: 'video',
    items: [
      { id: 'vid1', type: 'video', title: 'Summer Promo Video', date: '15/10/2024', thumbnail: '🎬' },
      { id: 'vid2', type: 'video', title: 'New Menu Video', date: 'Sept 15, 2024', thumbnail: '🎥' },
      { id: 'vid3', type: 'video', title: 'Pineapple is Best Video', date: 'Aug 12, 2024', thumbnail: '🎹' },
    ],
  },
  {
    id: 'my-images',
    icon: '🖼️',
    title: 'My Images',
    subtitle: 'Uploaded from your PC',
    isSystem: true,
    listType: 'image',
    items: [
      { id: 'img1', type: 'image', title: 'New Menu Image', thumbnail: '🖼️' },
      { id: 'img2', type: 'image', title: 'We are Hiring!', date: 'Oct 1, 2025', thumbnail: '📷' },
    ],
  },
  {
    id: 'creators',
    icon: '✨',
    title: 'Made by Creators',
    subtitle: 'Your own creations!',
    isSystem: true,
    listType: 'video',
    items: [
      { id: 'creator1', type: 'video', title: 'Shabbat Shalom Story', date: 'Oct 15, 2024', thumbnail: '✨' },
      { id: 'creator2', type: 'video', thumbnail: '🎬' },
      { id: 'creator3', type: 'video', title: 'Two Guys Video', date: 'Oct 12, 2025', thumbnail: '🎥' },
      { id: 'creator4', type: 'video', title: 'Cheese is Everything Video', date: 'Sept 31, 2024', thumbnail: '🎹' },
      { id: 'creator5', type: 'video', title: "I'm Laughing I'm Crying Video", date: 'Oct 1, 2025', thumbnail: '🎭' },
      { id: 'creator6', type: 'video', title: 'Burger is my shining Star Video', date: 'July 15, 2022', thumbnail: '🌟' },
      { id: 'creator7', type: 'video', title: 'Star Video', thumbnail: '💫' },
    ],
  },
  {
    id: 'producer',
    icon: '🎯',
    title: 'Made by Producer Mode',
    subtitle: 'Your own creations!',
    isSystem: true,
    listType: 'video',
    items: [
      { id: 'producer1', type: 'video', title: 'Purim Party Video', thumbnail: '🎭' },
    ],
  },
];

const CUSTOM_LIST_EMOJIS = [
  '🎨', '🚀', '✨', '🔥', '💡', 
  '🎯', '🌟', '💫', '🎪', '🎭',
  '🎸', '🎮', '🍕', '🌈', '⚡',
  '🦄', '🎉', '💎', '🏆', '🌺'
];

export const useContentLists = () => {
  const [lists, setLists] = useState<ContentList[]>(SYSTEM_LISTS);
  const [listCounter, setListCounter] = useState(1);
  const newListIdRef = useRef<string | null>(null);

  const addNewList = useCallback(() => {
  const randomEmoji = CUSTOM_LIST_EMOJIS[Math.floor(Math.random() * CUSTOM_LIST_EMOJIS.length)];
  const newListId = `custom-list-${listCounter}`;
  
  const newList: ContentList = {
    id: newListId,
    icon: randomEmoji,
    title: 'My new playlist',
    subtitle: 'Custom playlist',
    isSystem: false,
    listType: 'video',
    items: [],
  };
  
    setLists(prev => [...prev, newList]);
    setListCounter(prev => prev + 1);
    
    // Store the new list ID so we can scroll to it
    newListIdRef.current = newListId;
    
    return newListId; // Make sure this line exists
  }, [listCounter]);

  const getNewListId = useCallback(() => {
    const id = newListIdRef.current;
    newListIdRef.current = null;
    return id;
  }, []);

  const deleteList = useCallback((listId: string) => {
    console.log('Deleting list:', listId);
    setLists(prev => {
      const filtered = prev.filter(list => list.id !== listId);
      console.log('Lists after delete:', filtered);
      return filtered;
    });
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
    getNewListId,
    deleteList,
    updateListTitle,
    updateListIcon,
    moveItem,
    deleteItem,
    toggleFavorite,
    uploadContent,
  };
};