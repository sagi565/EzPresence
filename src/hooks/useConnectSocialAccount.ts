import { useState, useCallback } from 'react';
import { SocialAccount, SocialPlatform } from '@models/SocialAccount';

interface UseConnectSocialAccountReturn {
  isConnected: boolean;
  account: SocialAccount | null;
  loading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const useConnectSocialAccount = (
  platform: SocialPlatform,
  brandId: string
): UseConnectSocialAccountReturn => {
  const [account, setAccount] = useState<SocialAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful connection with platform-specific account names
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

      setAccount(newAccount);

      // In production, this would call:
      // const response = await fetch('/api/social-accounts/connect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ brandId, platform }),
      // });
      // const data = await response.json();
      // setAccount(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [platform, brandId]);

  const disconnect = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      setAccount(null);

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
  }, [platform, brandId]);

  return {
    isConnected: account !== null && account.isConnected,
    account,
    loading,
    error,
    connect,
    disconnect,
  };
};