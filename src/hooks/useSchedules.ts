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
      
      // Convert API schedules to internal format
      const convertedPosts = response.map((schedule, index) => 
        convertApiScheduleToPost(schedule, index)
      );
      
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
  }) => {
    try {
      const apiData = convertPostToApiSchedule(scheduleData);

      // POST /api/schedules - Creates a new schedule
      await api.post('/schedules', apiData);
      
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
  const deleteSchedule = useCallback(async (scheduleId: string) => {
    try {
      // Note: The API spec doesn't show a specific schedule delete endpoint
      // You may need to add this to your backend
      console.warn('Schedule deletion - check API for correct endpoint');
      
      // Remove from local state
      setPosts(prev => prev.filter(p => p.id !== scheduleId));
    } catch (err: any) {
      console.error('Failed to delete schedule:', err);
      throw err;
    }
  }, []);

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
  };
};