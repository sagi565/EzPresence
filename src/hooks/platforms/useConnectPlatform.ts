import { useState, useCallback } from 'react';
import { SocialAccount, SocialPlatform } from '@models/SocialAccount';
import { api, getApiBaseUrl } from '@utils/apiClient';
import { auth } from '@lib/firebase';
import { getIdToken } from 'firebase/auth';

interface UseConnectPlatformReturn {
  isConnected: boolean;
  account: SocialAccount | null;
  loading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export const useConnectPlatform = (
  platform: SocialPlatform,
  brandId: string,
  isUninitialized: boolean = false
): UseConnectPlatformReturn => {
  const [account, setAccount] = useState<SocialAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Not authenticated');
      }
      const token = await getIdToken(user, false);

      // Call API
      const apiBaseUrl = getApiBaseUrl();
      let url = `${apiBaseUrl}/platforms/connect?platform=${platform}`;

      // If brandId is provided and marked as uninitialized, append the query param
      if (brandId && isUninitialized) {
        url += `&uninitializedBrandUuid=${brandId}`;
      }

      console.log(`[Platform] Fetching: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Firebase-Token': token,
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`[Platform] Response status: ${response.status}`);

      const rawText = await response.text();
      console.log(`[Platform] Raw response: "${rawText}"`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${rawText}`);
      }

      // Extract URL from response
      let oauthUrl: string | null = null;

      try {
        const json = JSON.parse(rawText);
        console.log(`[Platform] Parsed JSON:`, json);
        oauthUrl = json.url || json.redirectUrl || json.authorizationUrl || json;
      } catch {
        oauthUrl = rawText.trim();
        if (oauthUrl.startsWith('"') && oauthUrl.endsWith('"')) {
          oauthUrl = oauthUrl.slice(1, -1);
        }
      }

      console.log(`[Platform] Extracted URL: "${oauthUrl}"`);

      if (!oauthUrl || !oauthUrl.startsWith('http')) {
        throw new Error(`Invalid OAuth URL received: ${oauthUrl}`);
      }

      // Open popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      console.log(`[Platform] Opening popup with URL: ${oauthUrl}`);

      const popup = window.open(
        oauthUrl,
        `OAuth_${platform}`,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups.');
      }

      // Wait for popup to close
      await new Promise<void>((resolve, reject) => {
        let isSuccess = false;

        const messageHandler = (event: MessageEvent) => {
          if (event.data?.type === 'oauth_success') {
            isSuccess = true;
            window.removeEventListener('message', messageHandler);
            resolve();
          } else if (event.data?.type === 'oauth_error') {
            window.removeEventListener('message', messageHandler);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageHandler);

        const pollInterval = setInterval(() => {
          if (popup.closed) {
            clearInterval(pollInterval);
            window.removeEventListener('message', messageHandler);
            if (isSuccess) {
              // Already resolved
            } else {
              // Closed without success message
              reject(new Error('Connection cancelled or failed'));
            }
          }
        }, 500);

        // Safety timeout
        setTimeout(() => {
          clearInterval(pollInterval);
          window.removeEventListener('message', messageHandler);
          if (!popup.closed) popup.close();
          if (!isSuccess) reject(new Error('Timeout'));
        }, 5 * 60 * 1000);
      });

      // Set connected account
      setAccount({
        id: `${platform}-${Date.now()}`,
        platform,
        accountName: platform,
        accountId: '',
        isConnected: true,
        connectedAt: new Date().toISOString(),
      });

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
      console.error(`[Platform] Error:`, err);
    } finally {
      setLoading(false);
    }
  }, [platform]);

  const disconnect = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/platforms/disconnect?platform=${platform}`;
      if (brandId && isUninitialized) {
        url += `&uninitializedBrandUuid=${brandId}`;
      }

      await api.delete(url);
      setAccount(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Disconnect failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [platform, brandId, isUninitialized]);

  return {
    isConnected: account !== null && account.isConnected,
    account,
    loading,
    error,
    connect,
    disconnect,
  };
};