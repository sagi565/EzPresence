import { auth } from '@lib/firebase';
import { getIdToken } from 'firebase/auth';

const API_BASE_URL = 'http://192.168.1.12:5112/api'; 

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  try {
    return await getIdToken(user);
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers = new Headers(options.headers as HeadersInit);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  console.log('🔵 [API CLIENT] Making request:', options.method || 'GET', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for session management
    });

    console.log('📩 [API CLIENT] Response:', response.status, url);

    // Handle different response statuses
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData;
      
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new ApiError(response.status, errorMessage, errorData);
    }

    // Handle empty responses (204 No Content, etc.)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('⚠️ [API CLIENT] Non-JSON response');
      return null as T;
    }

    const data = await response.json();
    console.log('✅ [API CLIENT] Success:', url);
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('❌ [API CLIENT] API Error:', error.status, error.message);
      throw error;
    }
    
    // Network or other errors
    console.error('❌ [API CLIENT] Network error:', error);
    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};