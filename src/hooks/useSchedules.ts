import { useState, useEffect, useCallback } from 'react';
import {
  Post,
  Platform,
  MediaType,
  ApiScheduleDto,
  convertApiScheduleToPost,
  convertPostToApiSchedule,
  parseTimeString
} from '@models/Post';
import { api } from '@utils/apiClient';

// Module-level shared map: all useSchedules instances share this
// so contentUuids stored by the modal's instance are visible to SchedulerPage's instance
const contentUuidsMap: Record<string, string[]> = {};

export const useSchedules = (brandId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules from API
  const fetchSchedules = useCallback(async (startTime?: Date, endTime?: Date) => {
    if (!brandId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query params for date range filtering
      let queryParams = '';
      if (startTime || endTime) {
        const params = new URLSearchParams();
        if (startTime) params.append('start_time', startTime.toISOString());
        if (endTime) params.append('end_time', endTime.toISOString());
        queryParams = `?${params.toString()}`;
      }

      // GET /api/schedules - Retrieves all schedules for the active brand
      const response = await api.get<ApiScheduleDto[]>(`/schedules${queryParams}`);

      if (!response || !Array.isArray(response)) {
        setPosts([]);
        return;
      }

      // Debug: log ALL fields from the first raw schedule to find contentUuids
      if (response.length > 0) {
        console.log('📋 [useSchedules] Raw API schedule[0] ALL KEYS:', Object.keys(response[0]));
        console.log('📋 [useSchedules] Raw API schedule[0] FULL:', JSON.stringify(response[0], null, 2));
      }

      // Convert API schedules to internal format
      const convertedPosts = response.map((schedule, index) => {
        const post = convertApiScheduleToPost(schedule, index);

        // Merge locally-stored contentUuids (API doesn't return them)
        const key = post.calendarItemId || post.scheduleUuid || post.id;
        if (contentUuidsMap[key]) {
          post.contentUuids = contentUuidsMap[key];
        }
        // Try title+date fallback key
        if (!post.contentUuids) {
          const fallbackKey = `${post.title}_${post.date.toISOString()}`;
          if (contentUuidsMap[fallbackKey]) {
            post.contentUuids = contentUuidsMap[fallbackKey];
            // Move to primary key for future lookups
            contentUuidsMap[key] = contentUuidsMap[fallbackKey];
          }
        }
        // Also check if API happened to return them
        if (schedule.contentUuids && schedule.contentUuids.length > 0) {
          post.contentUuids = schedule.contentUuids;
          contentUuidsMap[key] = schedule.contentUuids;
        }

        return post;
      });

      // Sort by date
      convertedPosts.sort((a, b) => a.date.getTime() - b.date.getTime());

      setPosts(convertedPosts);
    } catch (err: any) {
      console.error('Failed to fetch schedules:', err);
      setError(err.message || 'Failed to load schedules');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  // Fetch schedules when brandId changes
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Create a new schedule
  const createSchedule = useCallback(async (scheduleData: {
    date: Date;
    time: string;
    platforms: Platform[];
    media: MediaType;
    title: string;
    description?: string;
    contentUuids?: string[];
    rruleText?: string;
    endDate?: Date;
    type?: 'Post' | 'Story';
    timezone?: string;
    status?: string;
  }) => {
    try {
      const apiData = convertPostToApiSchedule(scheduleData);

      // POST /api/schedules - Creates a new schedule
      const result = await api.post<any>('/schedules', apiData);

      // Store contentUuids locally — API doesn't return them in GET response
      if (scheduleData.contentUuids && scheduleData.contentUuids.length > 0) {
        // Try to get the ID from the response
        const newId = typeof result === 'string' ? result : result?.calendarItemId || result?.scheduleId || result?.id;
        if (newId) {
          contentUuidsMap[newId] = scheduleData.contentUuids;
        }
        // Also store by title+date as a fallback key for matching after refetch
        const fallbackKey = `${scheduleData.title}_${scheduleData.date.toISOString()}`;
        contentUuidsMap[fallbackKey] = scheduleData.contentUuids;
      }

      // Refetch to get the created schedule
      await fetchSchedules();
    } catch (err: any) {
      console.error('Failed to create schedule:', err);
      throw err;
    }
  }, [fetchSchedules]);

  // Update a schedule
  const updateSchedule = useCallback(async (
    calendarItemId: string,
    updates: Partial<{
      date: Date;
      time: string;
      platforms: Platform[];
      media: MediaType;
      title: string;
      description?: string;
      status?: string;
    }>,
    updateOccurrenceOnly: boolean = false
  ) => {
    try {
      // Build the updated properties object
      const updatedProperties: Record<string, any> = {};

      if (updates.date && updates.time) {
        const { hours, minutes } = parseTimeString(updates.time);
        const scheduledDate = new Date(updates.date);
        scheduledDate.setHours(hours, minutes, 0, 0);
        updatedProperties.plannedAtUtc = scheduledDate.toISOString();
      }

      if (updates.platforms) updatedProperties.targets = updates.platforms;
      if (updates.media) updatedProperties.postType = updates.media;
      if (updates.title) {
        updatedProperties.scheduleName = updates.title;
        updatedProperties.scheduleTitle = updates.title;
      }
      if (updates.description !== undefined) {
        updatedProperties.scheduleDescription = updates.description;
      }
      if (updates.status) updatedProperties.status = updates.status;

      // PUT /api/schedules - Partially updates an existing schedule
      await api.put('/schedules', {
        calendarItemId,
        updatedProperties,
        updateOccurrenceOnly,
      });

      // Refetch to get the updated schedule
      await fetchSchedules();
    } catch (err: any) {
      console.error('Failed to update schedule:', err);
      throw err;
    }
  }, [fetchSchedules]);

  // Delete a schedule
  const deleteSchedule = useCallback(async (scheduleUuid: string, plannedDate: Date, deleteOccurrenceOnly: boolean = false) => {
    try {
      // The back-end expects calendarItemId = Base64(scheduleId + "|" + plannedAtDate)
      // plannedAtDate format: 2026-02-22T15:42:00.0000000Z (Microseconds included)
      const d = new Date(plannedDate);
      d.setMilliseconds(0);
      const isoString = d.toISOString(); // YYYY-MM-DDTHH:mm:ss.000Z
      const formattedDate = isoString.replace('.000Z', '.0000000Z');

      const rawId = `${scheduleUuid}|${formattedDate}`;
      const calendarItemId = btoa(rawId);

      const params = new URLSearchParams();
      params.append('calendarItemId', calendarItemId);
      params.append('deleteOccurrenceOnly', deleteOccurrenceOnly.toString());

      await api.delete(`/schedules/calendarItemId?${params.toString()}`);

      // Refetch to sync state
      await fetchSchedules();
    } catch (err: any) {
      console.error('Failed to delete schedule:', err);

      // If endpoint doesn't exist yet (404), still remove from local state
      if (err?.response?.status === 404 || err?.status === 404) {
        console.warn('Delete endpoint not found, removing from local state only');
        setPosts(prev => prev.filter(p => (p.scheduleUuid || p.id) !== scheduleUuid));
      } else {
        throw err;
      }
    }
  }, [fetchSchedules]);

  // Get a specific calendar item
  const getCalendarItem = useCallback(async (calendarItemId: string) => {
    try {
      // GET /api/schedules/calendarItemId?calendarItemId={base64}
      const response = await api.get(`/schedules/calendarItemId?calendarItemId=${encodeURIComponent(calendarItemId)}`);
      return response;
    } catch (err: any) {
      console.error('Failed to get calendar item:', err);
      throw err;
    }
  }, []);

  // Get all calendar items for a schedule
  const getScheduleCalendarItems = useCallback(async (scheduleUuid: string) => {
    try {
      // GET /api/schedules/scheduleId?scheduleUuid={uuid}
      const response = await api.get(`/schedules/scheduleId?scheduleUuid=${scheduleUuid}`);
      return response;
    } catch (err: any) {
      console.error('Failed to get schedule calendar items:', err);
      throw err;
    }
  }, []);

  // Store contentUuids locally for a schedule (API doesn't return them)
  const storeContentUuids = useCallback((scheduleId: string, contentUuids: string[]) => {
    if (scheduleId && contentUuids.length > 0) {
      contentUuidsMap[scheduleId] = contentUuids;
    }
  }, []);

  return {
    posts,
    loading,
    error,
    refetchSchedules: fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getCalendarItem,
    getScheduleCalendarItems,
    storeContentUuids,
  };
};