import { useState, useCallback } from 'react';
import { api } from '@utils/apiClient';

export interface VisionPlanRequestDto {
  userPrompt: string;
  durationLevel?: string;      // e.g. "short" | "medium" | "long"
  imagesList?: string[];        // base64 or URLs of attached images
  numScenes?: number;
  llmModel?: string;
}

export interface VisionPlanResponse {
  planUuid: string;
}

export interface SocialVideoContext {
  platform: 'youtube' | 'instagram' | 'tiktok' | 'facebook';
  url: string;
  offsetSeconds: number;
  durationSeconds: number;
}

export const useVisionPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planUuid, setPlanUuid] = useState<string | null>(null);

  const generatePlan = useCallback(
    async (
      prompt: string,
      options?: {
        durationLevel?: string;
        imagesList?: string[];
        numScenes?: number;
        llmModel?: string;
        socialVideo?: SocialVideoContext;
      }
    ): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: VisionPlanRequestDto = {
          userPrompt: prompt,
          durationLevel: options?.durationLevel,
          imagesList: options?.imagesList,
          numScenes: options?.numScenes,
          llmModel: options?.llmModel,
        };

        // If a social video link is provided, append context to the prompt
        if (options?.socialVideo) {
          const { platform, url, offsetSeconds, durationSeconds } = options.socialVideo;
          payload.userPrompt = `${prompt}\n\n[Reference audio from ${platform}: ${url} | offset: ${offsetSeconds}s, duration: ${durationSeconds}s]`;
        }

        const uuid = await api.post<string>('/studio/vision/creator/plan', payload);
        setPlanUuid(uuid);
        return uuid;
      } catch (err: any) {
        const message = err?.message || 'Failed to generate vision plan';
        setError(message);
        console.error('❌ [useVisionPlan] Error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setPlanUuid(null);
  }, []);

  return {
    isLoading,
    error,
    planUuid,
    generatePlan,
    reset,
  };
};
