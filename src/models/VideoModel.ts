export type VideoModelType = 'Veo 3' | 'Veo 2';

export interface VideoModel {
  id: VideoModelType;
  name: string;
  description: string;
  price: number;
  hasSound: boolean;
}

export const VIDEO_MODELS: Record<VideoModelType, VideoModel> = {
  'Veo 3': {
    id: 'Veo 3',
    name: 'Veo 3',
    description: 'Best AI model to date\nSupports sound',
    price: 8000,
    hasSound: true,
  },
  'Veo 2': {
    id: 'Veo 2',
    name: 'Veo 2',
    description: 'Great AI model for simpler videos\nNo sound',
    price: 1600,
    hasSound: false,
  },
};