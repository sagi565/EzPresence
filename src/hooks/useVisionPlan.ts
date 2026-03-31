import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '@utils/apiClient';

const SESSION_KEY = 'vision_plan_uuid';

export interface VisionPlanRequestDto {
  userPrompt: string;
  durationLevel?: string;
  imagesList?: string[];
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

export interface VisionScene {
  [key: string]: any;
}

export interface VisionPlan {
  planUuid: string;
  planType?: string;
  clipTitle?: string;
  clipVisualStyle?: string;
  clipMusicInstructions?: string;
  clipVoiceInstructions?: string;
  clipVoiceGender?: string;
  category?: string;
  includeAudioInVideoGeneration?: boolean;
  scenes?: any;
  socialMediaLink?: { url?: string; offset?: number; duration?: number; };
  mediaContentUuid?: string;
  version?: number;
  totalVersions?: number;
}

const POLL_INTERVAL = 2500;
const MAX_POLL_ATTEMPTS = 72; // 3 minutes

export const useVisionPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(() => !!sessionStorage.getItem(SESSION_KEY));
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planUuid, setPlanUuid] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  const [plan, setPlan] = useState<VisionPlan | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearTimeout(pollRef.current); pollRef.current = null; }
    setIsPolling(false);
  }, []);

  const pollPlan = useCallback(async (uuid: string) => {
    attemptsRef.current += 1;
    if (attemptsRef.current > MAX_POLL_ATTEMPTS) {
      stopPolling();
      setError('Plan generation timed out. Please try again.');
      return;
    }
    try {
      const result = await api.get<VisionPlan>(`/studio/vision/plans/${uuid}`);
      if (result && result.scenes && (
        Array.isArray(result.scenes) ? result.scenes.length > 0 : Object.keys(result.scenes).length > 0
      )) {
        sessionStorage.removeItem(SESSION_KEY);
        setPlan(result);
        stopPolling();
        return;
      }
      pollRef.current = setTimeout(() => pollPlan(uuid), POLL_INTERVAL);
    } catch {
      if (attemptsRef.current < MAX_POLL_ATTEMPTS) {
        pollRef.current = setTimeout(() => pollPlan(uuid), POLL_INTERVAL);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        stopPolling();
        setError('Failed to retrieve plan. Please try again.');
      }
    }
  }, [stopPolling]);

  const generatePlan = useCallback(async (
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
    setPlan(null);
    setPlanUuid(null);
    stopPolling();
    try {
      const payload: any = {
        userPrompt: prompt,
        durationLevel: options?.durationLevel,
        imagesList: options?.imagesList,
        numScenes: options?.numScenes,
        llmModel: options?.llmModel,
      };
      if (options?.socialVideo) {
        const { platform, url, offsetSeconds, durationSeconds } = options.socialVideo;
        payload.userPrompt = `${prompt}\n\n[Reference audio from ${platform}: ${url} | offset: ${offsetSeconds}s, duration: ${durationSeconds}s]`;
        payload.socialMediaLink = { url, offset: offsetSeconds, duration: durationSeconds };
      }
      const response = await api.post<any>('/studio/vision/creator/plan', payload);
      const uuid = response?.plan_uuid || response?.planUuid || (typeof response === 'string' ? response : null);
      if (!uuid) { setError('No plan ID returned from server.'); return null; }
      sessionStorage.setItem(SESSION_KEY, uuid);
      setPlanUuid(uuid);
      setIsLoading(false);
      setIsPolling(true);
      attemptsRef.current = 0;
      pollRef.current = setTimeout(() => pollPlan(uuid), POLL_INTERVAL);
      return uuid;
    } catch (err: any) {
      setError(err?.message || 'Failed to generate vision plan');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [pollPlan, stopPolling]);

  /** Update plan fields on the server (only changed fields) */
  const updatePlan = useCallback(async (uuid: string, updatedProperties: Record<string, any>): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    try {
      await api.put('/studio/vision/plans', { planUuid: uuid, updatedProperties });
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to update plan.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /** Execute the plan (generate the video) */
  const executePlan = useCallback(async (uuid: string, version?: number): Promise<boolean> => {
    setIsExecuting(true);
    setError(null);
    try {
      await api.post('/studio/vision/creator/execute', { planUuid: uuid, useMockAssets: false, version });
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to execute plan.');
      return false;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && !plan) {
      setPlanUuid(saved);
      setIsPolling(true);
      attemptsRef.current = 0;
      pollRef.current = setTimeout(() => pollPlan(saved), POLL_INTERVAL);
    }
    return () => { if (pollRef.current) clearTimeout(pollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    stopPolling();
    setIsLoading(false);
    setError(null);
    setPlanUuid(null);
    setPlan(null);
    attemptsRef.current = 0;
  }, [stopPolling]);

  return {
    isLoading, isPolling, isUpdating, isExecuting,
    error, planUuid, plan,
    generatePlan, updatePlan, executePlan, reset,
  };
};