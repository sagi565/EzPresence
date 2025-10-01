export type ContentOrigin = 'presence' | 'external';

export interface Content {
  id: string;
  title: string;
  thumbnail: string;
  favorite: boolean;
  origin: ContentOrigin;
}