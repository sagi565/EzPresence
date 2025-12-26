import { useState, useCallback } from 'react';
import { 
  SocialAccount, 
  SocialPlatform, 
  ConnectSocialAccountRequest,
  DisconnectSocialAccountRequest 
} from '@models/SocialAccount';

interface UseSocialPlatformsReturn {
  socialAccounts: SocialAccount[];
  loading: boolean;
  error: string | null;
  connectAccount: (platform: SocialPlatform, brandId: string) => Promise<void>;
  disconnectAccount: (platform: SocialPlatform, brandId: string) => Promise<void>;
  isConnected: (platform: SocialPlatform) => boolean;
  getAccountByPlatform: (platform: SocialPlatform) => SocialAccount | undefined;
}

export const useSocialPlatforms = (brandId?: string): UseSocialPlatformsReturn => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectAccount = useCallback(async (platform: SocialPlatform, brandId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful connection
      const mockAccountNames: Record<SocialPlatform, string> = {
        facebook: 'Your Business Page',
        instagram: '@yourbrand',
        tiktok: '@yourbrand_official',
        youtube: 'Your Brand Channel',
      };

      const newAccount: SocialAccount = {
        id: `${platform}-${Date.now()}`,
        platform,
        accountName: mockAccountNames[platform],
        accountId: `${platform}_${Math.random().toString(36).substr(2, 9)}`,
        isConnected: true,
        connectedAt: new Date().toISOString(),
        profileUrl: `https://${platform}.com/yourbrand`,
        followerCount: Math.floor(Math.random() * 50000) + 1000,
      };

      setSocialAccounts(prev => {
        // Remove existing account for this platform if any
        const filtered = prev.filter(acc => acc.platform !== platform);
        return [...filtered, newAccount];
      });

      // In production, this would call:
      // const response = await fetch('/api/social-accounts/connect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ brandId, platform }),
      // });
      // const data = await response.json();
      // setSocialAccounts(prev => [...prev.filter(a => a.platform !== platform), data]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectAccount = useCallback(async (platform: SocialPlatform, brandId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setSocialAccounts(prev => prev.filter(acc => acc.platform !== platform));

      // In production:
      // await fetch('/api/social-accounts/disconnect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ brandId, platform }),
      // });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isConnected = useCallback((platform: SocialPlatform): boolean => {
    return socialAccounts.some(acc => acc.platform === platform && acc.isConnected);
  }, [socialAccounts]);

  const getAccountByPlatform = useCallback((platform: SocialPlatform): SocialAccount | undefined => {
    return socialAccounts.find(acc => acc.platform === platform);
  }, [socialAccounts]);

  return {
    socialAccounts,
    loading,
    error,
    connectAccount,
    disconnectAccount,
    isConnected,
    getAccountByPlatform,
  };
};