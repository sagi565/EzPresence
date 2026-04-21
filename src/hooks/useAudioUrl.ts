import { useState, useCallback } from 'react';
import { api } from '@utils/apiClient';

export interface AudioUrlResponse {
  audioLink: string;
  durationMs: number;
  videoName: string;
}

interface UseAudioUrlResult {
  fetchAudioUrl: (mediaLink: string) => Promise<AudioUrlResponse | null>;
  data: AudioUrlResponse | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useAudioUrl(): UseAudioUrlResult {
  const [data, setData] = useState<AudioUrlResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioUrl = useCallback(async (mediaLink: string): Promise<AudioUrlResponse | null> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await api.post<AudioUrlResponse>('/studio/audio-url', {
        mediaLink: mediaLink.trim(),
      });
      setData(res);
      return res;
    } catch (e: any) {
      const msg = e?.message || 'Failed to fetch audio. Check the URL and try again.';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { fetchAudioUrl, data, isLoading, error, reset };
}
