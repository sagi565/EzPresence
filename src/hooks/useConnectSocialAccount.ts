import { useState, useCallback } from 'react';
import { SocialAccount, SocialPlatform } from '@models/SocialAccount';
import { api } from '@utils/apiClient';

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
      // GET /api/oauth/connect?platform={platform}
      const response = await api.get<{ redirectUrl: string }>(
        `/oauth/connect?platform=${platform}`
      );

      // Open OAuth popup window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        response.redirectUrl,
        'OAuth Connect',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Poll for popup closure or listen for message
      const pollInterval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollInterval);
          // Check connection status after popup closes
          checkConnectionStatus();
        }
      }, 500);

      // Listen for OAuth callback message
      const messageHandler = (event: MessageEvent) => {
        if (event.data?.type === 'oauth_success') {
          clearInterval(pollInterval);
          popup?.close();
          checkConnectionStatus();
          window.removeEventListener('message', messageHandler);
        } else if (event.data?.type === 'oauth_error') {
          clearInterval(pollInterval);
          popup?.close();
          setError(event.data.error || 'OAuth connection failed');
          setLoading(false);
          window.removeEventListener('message', messageHandler);
        }
      };
      
      window.addEventListener('message', messageHandler);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect account');
      setLoading(false);
      throw err;
    }
  }, [platform]);

  const checkConnectionStatus = async () => {
    try {
      // You'll need to add an endpoint to check if a platform is connected
      // For now, we'll set a mock connected state
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
    } catch (err) {
      console.error('Failed to check connection status:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // DELETE /api/oauth/disconnect?platform={platform}
      await api.delete(`/oauth/disconnect?platform=${platform}`);
      
      setAccount(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect account');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [platform]);

  return {
    isConnected: account !== null && account.isConnected,
    account,
    loading,
    error,
    connect,
    disconnect,
  };
};