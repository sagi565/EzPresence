export type ContentItemType = 'video' | 'image' | 'upload';
export type ContentStatus = 'success' | 'failed' | 'scheduled';

export interface ContentItem {
  id: string;
  type: ContentItemType;
  title?: string;
  date?: string;
  thumbnail: string;
  favorite?: boolean;
  status?: ContentStatus;
}

export interface ContentList {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  isSystem: boolean;
  items: ContentItem[];
  listType: 'video' | 'image'; // Determines upload button size and item constraints
}

export const SYSTEM_LISTS: ContentList[] = [
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