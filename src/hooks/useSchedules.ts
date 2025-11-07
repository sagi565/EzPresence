import { useState, useEffect, useCallback } from 'react';
import { Post, Platform, PostStatus, MediaType } from '@models/Post';
import { api } from '@utils/apiClient';

// API Response matches ScheduleDto from OpenAPI spec
interface ApiSchedule {
  id: string; // uuid
  scheduledAt: string; // ISO datetime
  platforms: Platform[];
  status: PostStatus;
  mediaType: MediaType;
  title: string;
  description?: string;
  brandId?: string; // uuid
  mediaContentId?: string; // uuid
  tenantId?: number;
}

// Convert API schedule to internal Post format
const convertApiSchedule = (apiSchedule: ApiSchedule): Post => {
  const date = new Date(apiSchedule.scheduledAt);
  
  // Format time as "HH:MM AM/PM"
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const period = hours >= 12 ? 'PM' : 'AM';
  const time = `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;

  return {
    id: apiSchedule.id,
    date: date,
    time: time,
    platforms: apiSchedule.platforms,
    status: apiSchedule.status,
    media: apiSchedule.mediaType,
    title: apiSchedule.title,
  };
};

// Convert internal Post to API schedule format
const convertPostToApi = (post: Partial<Post> & { date: Date; time: string }): Partial<ApiSchedule> => {
  // Parse time string "HH:MM AM/PM"
  const [timePart, period] = post.time.split(' ');
  const [hourStr, minuteStr] = timePart.split(':');
  let hours = parseInt(hourStr);
  const minutes = parseInt(minuteStr);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  const scheduledDate = new Date(post.date);
  scheduledDate.setHours(hours, minutes, 0, 0);

  return {
    scheduledAt: scheduledDate.toISOString(),
    platforms: post.platforms,
    status: post.status,
    mediaType: post.media,
    title: post.title,
  };
};

export const useSchedules = (brandId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules from API
  const fetchSchedules = useCallback(async () => {
    if (!brandId) return;

    try {
      setLoading(true);
      setError(null);
      
      // GET /api/schedules
      // Note: Your API doesn't have brandId filtering in the OpenAPI spec
      // You may need to filter client-side or add query parameter support
      const response = await api.get<ApiSchedule[]>('/schedules');
      
      // Filter by brandId client-side
      const filteredSchedules = response.filter(s => s.brandId === brandId);
      
      // Convert API schedules to internal format
      const convertedPosts = filteredSchedules.map(convertApiSchedule);
      
      // Sort by date
      convertedPosts.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      setPosts(convertedPosts);
    } catch (err: any) {
      console.error('Failed to fetch schedules:', err);
      setError(err.message || 'Failed to load schedules');
      
      // Fallback to empty array on error
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
    status: PostStatus;
    media: MediaType;
    title: string;
    description?: string;
    mediaContentId?: string;
  }) => {
    try {
      const apiData = {
        ...convertPostToApi(scheduleData),
        brandId,
        description: scheduleData.description,
        mediaContentId: scheduleData.mediaContentId,
      };

      // POST /api/schedules
      // Note: API returns void, so we need to refetch or construct the response
      await api.post('/schedules', apiData);
      
      // Refetch to get the created schedule
      await fetchSchedules();
    } catch (err: any) {
      console.error('Failed to create schedule:', err);
      throw err;
    }
  }, [brandId, fetchSchedules]);

  // Update a schedule
  const updateSchedule = useCallback(async (scheduleId: string, updates: Partial<{
    date: Date;
    time: string;
    platforms: Platform[];
    status: PostStatus;
    media: MediaType;
    title: string;
    description?: string;
  }>) => {
    try {
      let apiUpdates: Partial<ApiSchedule> = {};

      if (updates.date && updates.time) {
        const converted = convertPostToApi({ date: updates.date, time: updates.time } as any);
        apiUpdates.scheduledAt = converted.scheduledAt;
      }

      if (updates.platforms) apiUpdates.platforms = updates.platforms;
      if (updates.status) apiUpdates.status = updates.status;
      if (updates.media) apiUpdates.mediaType = updates.media;
      if (updates.title) apiUpdates.title = updates.title;
      if (updates.description !== undefined) apiUpdates.description = updates.description;

      // PUT /api/schedules/{id}
      await api.put(`/schedules/${scheduleId}`, apiUpdates);
      
      // Refetch to get the updated schedule
      await fetchSchedules();
    } catch (err: any) {
      console.error('Failed to update schedule:', err);
      throw err;
    }
  }, [fetchSchedules]);

  // Delete a schedule
  const deleteSchedule = useCallback(async (scheduleId: string) => {
    try {
      // DELETE /api/schedules/{id}
      await api.delete(`/schedules/${scheduleId}`);
      setPosts(prev => prev.filter(p => p.id !== scheduleId));
    } catch (err: any) {
      console.error('Failed to delete schedule:', err);
      throw err;
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
  };
};