import { useState, useCallback } from 'react';
import {
  Post,
  Platform,
  MediaType,
  ApiScheduleDto,
  convertApiScheduleToPost,
  convertPostToApiSchedule,
  convertPlatformsToTargets,
  parseTimeString,
} from '@models/Post';
import { api } from '@utils/apiClient';

// Shared across all hook instances so contentUuids set by the modal
// are visible to the SchedulerPage after refetch.
const contentUuidsMap: Record<string, string[]> = {};

// Persists the last fetch window so refetches (after create/update/delete)
// use the same date range as the initial load.
let lastRequestedRange: { start: Date; end: Date } | null = null;

const formatLocalDateTime = (date: Date): string => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
};

export const useSchedules = (brandId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async (startTime?: Date, endTime?: Date) => {
    if (!brandId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let start: Date;
      let end: Date;

      if (startTime && endTime) {
        start = startTime;
        end = endTime;
        lastRequestedRange = { start, end };
      } else if (lastRequestedRange) {
        start = lastRequestedRange.start;
        end = lastRequestedRange.end;
      } else {
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);

        end = new Date();
        end.setMonth(end.getMonth() + 2);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
      }

      const params = new URLSearchParams();
      params.append('windowStartLocal', formatLocalDateTime(start));
      params.append('windowEndLocal', formatLocalDateTime(end));

      const response = await api.get<ApiScheduleDto[]>(`/schedules?${params.toString()}`);

      if (!response || !Array.isArray(response)) {
        setPosts([]);
        return;
      }

      const convertedPosts = response.map((schedule, index) => {
        const post = convertApiScheduleToPost(schedule, index);
        const key = post.calendarItemId || post.scheduleUuid || post.id;

        // Prefer contents returned by the API, then fall back to locally stored map
        if (schedule.contents && schedule.contents.length > 0) {
          post.contentUuids = schedule.contents;
          contentUuidsMap[key] = schedule.contents;
        } else if (contentUuidsMap[key]) {
          post.contentUuids = contentUuidsMap[key];
        } else {
          const fallbackKey = `${post.title}_${post.date.toISOString()}`;
          if (contentUuidsMap[fallbackKey]) {
            post.contentUuids = contentUuidsMap[fallbackKey];
            contentUuidsMap[key] = contentUuidsMap[fallbackKey];
          }
        }

        return post;
      });

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

  const createSchedule = useCallback(async (scheduleData: {
    date: Date;
    time: string;
    platforms: Platform[];
    media: MediaType;
    title: string;
    contentUuids?: string[];
    rruleText?: string;
    endDate?: Date;
    type?: 'Post' | 'Story';
    timezone?: string;
    status?: string;
  }) => {
    try {
      const apiData = convertPostToApiSchedule(scheduleData);
      const result = await api.post<any>('/schedules', apiData);

      if (scheduleData.contentUuids && scheduleData.contentUuids.length > 0) {
        const newId =
          typeof result === 'string'
            ? result
            : result?.calendarItemId || result?.scheduleId || result?.id;

        if (newId) {
          contentUuidsMap[newId] = scheduleData.contentUuids;
        }

        const fallbackKey = `${scheduleData.title}_${scheduleData.date.toISOString()}`;
        contentUuidsMap[fallbackKey] = scheduleData.contentUuids;
      }

      await fetchSchedules();
    } catch (err: any) {
      console.error('Failed to create schedule:', err);
      throw err;
    }
  }, [fetchSchedules]);

  const updateSchedule = useCallback(async (
    calendarItemId: string,
    updates: Partial<{
      date: Date;
      time: string;
      platforms: Platform[];
      media: MediaType;
      title: string;
      contentUuids: string[];
      status: string;
      rruleText: string | null;
      endDate: string | null;
      type: 'Post' | 'Story';
    }>,
    updateOccurrenceOnly: boolean = false
  ) => {
    try {
      const updatedProperties: Record<string, any> = {};

      if (updates.date && updates.time) {
        const { hours, minutes } = parseTimeString(updates.time);
        const d = new Date(updates.date);
        d.setHours(hours, minutes, 0, 0);
        updatedProperties.PlannedAt = formatLocalDateTime(d);
      }

      if (updates.platforms) {
        updatedProperties.Targets = convertPlatformsToTargets(updates.platforms);
      }

      if (updates.media || updates.type) {
        updatedProperties.UploadType = updates.type === 'Story' ? 'Story' : 'Post';
      }

      if (updates.title) {
        updatedProperties.ScheduleName = updates.title;
      }

      if (updates.status !== undefined) {
        updatedProperties.IsDraft = updates.status.toLowerCase() === 'draft';
      }

      if (updates.contentUuids !== undefined) {
        updatedProperties.Contents = updates.contentUuids;
      }

      if (updates.rruleText !== undefined || updates.endDate !== undefined) {
        const policy: Record<string, any> = {};
        if (updates.rruleText !== undefined) {
          policy.Rrule = updates.rruleText;
        }
        if (updates.endDate !== undefined) {
          policy.EndTime = updates.endDate;
        }
        updatedProperties.Policy = policy;
      }

      if (Object.keys(updatedProperties).length === 0) {
        return;
      }

      await api.put('/schedules', {
        calendarItemId,
        updatedProperties,
        updateOccurrenceOnly,
      });

      await fetchSchedules();
    } catch (err: any) {
      console.error('Failed to update schedule:', err);
      throw err;
    }
  }, [fetchSchedules]);

  const deleteSchedule = useCallback(async (
    scheduleUuidOrCalendarItemId: string,
    plannedDate: Date,
    deleteOccurrenceOnly: boolean = false,
    force: boolean = false
  ) => {
    try {
      let calendarItemId: string;

      if (scheduleUuidOrCalendarItemId.includes('|')) {
        // Raw composite key → encode it
        calendarItemId = btoa(scheduleUuidOrCalendarItemId);
      } else if (
        scheduleUuidOrCalendarItemId.length > 20 &&
        !scheduleUuidOrCalendarItemId.includes('-')
      ) {
        // Already base64-encoded
        calendarItemId = scheduleUuidOrCalendarItemId;
      } else {
        // scheduleUuid only → build composite key and encode
        const d = new Date(plannedDate);
        d.setMilliseconds(0);
        const formattedDate = d.toISOString().replace('.000Z', '.0000000Z');
        calendarItemId = btoa(`${scheduleUuidOrCalendarItemId}|${formattedDate}`);
      }

      const params = new URLSearchParams({
        calendarItemId,
        deleteOccurrenceOnly: deleteOccurrenceOnly.toString(),
        force: force.toString(),
      });

      await api.delete(`/schedules/calendarItemId?${params.toString()}`);
      await fetchSchedules();
    } catch (err: any) {
      console.error('Failed to delete schedule:', err);

      if (err?.response?.status === 404 || err?.status === 404) {
        console.warn('Delete endpoint returned 404, removing from local state only');
        setPosts(prev =>
          prev.filter(p => (p.scheduleUuid || p.id) !== scheduleUuidOrCalendarItemId)
        );
      } else {
        throw err;
      }
    }
  }, [fetchSchedules]);

  const getCalendarItem = useCallback(async (calendarItemId: string) => {
    try {
      return await api.get(`/schedules/calendarItemId?calendarItemId=${encodeURIComponent(calendarItemId)}`);
    } catch (err: any) {
      console.error('Failed to get calendar item:', err);
      throw err;
    }
  }, []);

  const getScheduleCalendarItems = useCallback(async (scheduleUuid: string) => {
    try {
      return await api.get(`/schedules/scheduleId?scheduleUuid=${scheduleUuid}`);
    } catch (err: any) {
      console.error('Failed to get schedule calendar items:', err);
      throw err;
    }
  }, []);

  const storeContentUuids = useCallback((scheduleId: string, uuids: string[]) => {
    if (scheduleId && uuids.length > 0) {
      contentUuidsMap[scheduleId] = uuids;
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