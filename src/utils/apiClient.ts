import { auth } from '@lib/firebase';
import { getIdToken } from 'firebase/auth';

// Get API base URL from environment variable
const API_BASE_URL = 'https://192.168.1.12:7291/api';

// Export function to get the base URL (for use in other places like OAuth)
export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};

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
    const token = await getIdToken(user, false);
    console.log('🔑 [API CLIENT] Got Firebase token');
    return token;
  } catch (error) {
    console.error('❌ [API CLIENT] Failed to get auth token:', error);
    return null;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
): Promise<T> {
  const token = await getAuthToken();
  
  // If auth is required but no token, throw an error
  if (requireAuth && !token) {
    console.warn('⚠️ [API CLIENT] Auth required but no token available');
    throw new ApiError(401, 'Authentication required. Please log in.');
  }
  
  const headers = new Headers(options.headers as HeadersInit);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  // Use X-Firebase-Token header as specified in the API spec
  if (token) {
    headers.set('X-Firebase-Token', token);
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  console.log('🔵 [API CLIENT] Making request:', options.method || 'GET', url);
  console.log('🔵 [API CLIENT] Has token:', !!token);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors',
    });

    console.log('📩 [API CLIENT] Response:', response.status, url);

    // Handle different response statuses
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData;
      
      try {
        const text = await response.text();
        if (text) {
          errorData = JSON.parse(text);
          errorMessage = errorData.message || errorData.error || errorData.title || errorMessage;
        }
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      
      console.error('❌ [API CLIENT] HTTP Error:', response.status, errorMessage);
      throw new ApiError(response.status, errorMessage, errorData);
    }

    // Handle empty responses (204 No Content, etc.)
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    if (response.status === 204 || contentLength === '0') {
      console.log('✅ [API CLIENT] Empty response (success):', url);
      return null as T;
    }
    
    if (!contentType || !contentType.includes('application/json')) {
      console.log('⚠️ [API CLIENT] Non-JSON response, content-type:', contentType);
      const text = await response.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        return text as unknown as T;
      }
    }

    const data = await response.json();
    console.log('✅ [API CLIENT] Success:', url);
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('❌ [API CLIENT] Network error:', error);
    
    let errorMessage = 'Network error occurred';
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Unable to connect to server. Please check:\n' +
        '1. Backend server is running\n' +
        '2. CORS is configured on the backend\n' +
        '3. The API URL is correct';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    throw new ApiError(0, errorMessage);
  }
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit & { requireAuth?: boolean }) => {
    const { requireAuth = true, ...restOptions } = options || {};
    return apiRequest<T>(endpoint, { ...restOptions, method: 'GET' }, requireAuth);
  },
  
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit & { requireAuth?: boolean }) => {
    const { requireAuth = true, ...restOptions } = options || {};
    return apiRequest<T>(endpoint, {
      ...restOptions,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth);
  },
  
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit & { requireAuth?: boolean }) => {
    const { requireAuth = true, ...restOptions } = options || {};
    return apiRequest<T>(endpoint, {
      ...restOptions,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth);
  },
  
  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit & { requireAuth?: boolean }) => {
    const { requireAuth = true, ...restOptions } = options || {};
    return apiRequest<T>(endpoint, {
      ...restOptions,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth);
  },
  
  delete: <T = any>(endpoint: string, options?: RequestInit & { requireAuth?: boolean }) => {
    const { requireAuth = true, ...restOptions } = options || {};
    return apiRequest<T>(endpoint, { ...restOptions, method: 'DELETE' }, requireAuth);
  },
};