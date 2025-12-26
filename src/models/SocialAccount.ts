export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  accountId: string;
  isConnected: boolean;
  connectedAt?: string;
  profileUrl?: string;
  followerCount?: number;
}

export interface ConnectSocialAccountRequest {
  brandId: string;
  platform: SocialPlatform;
}

export interface DisconnectSocialAccountRequest {
  brandId: string;
  platform: SocialPlatform;
}

export const PLATFORM_COLORS: Record<SocialPlatform, { primary: string; secondary: string; gradient: string }> = {
  facebook: {
    primary: '#1877F2',
    secondary: '#4267B2',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #2E8AF6 63%, #5BA3F8 86%, #8EC5FC 100%)',
  },
  instagram: {
    primary: '#C13584',
    secondary: '#FD1D1D',
    gradient: 'linear-gradient(135deg, #833AB4 0%, #C13584 33%, #E1306C 66%, #F77737 100%)',
  },
  tiktok: {
    primary: '#000000',
    secondary: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 66%, #333333 86%, #4d4d4d 100%)',
  },
  youtube: {
    primary: '#FF0000',
    secondary: '#282828',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #FF4444 66%, #FF6666 86%, #FF9999 100%)',
  },
};

export const PLATFORM_NAMES: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};