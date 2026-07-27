import axios from 'axios';

const BASE_URL = 'https://bhli-backend.onrender.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to headers and log every API hit
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log(
      `🚀 [API Request] ${config.method?.toUpperCase()} ${fullUrl}`,
      {
        params: config.params,
        data: config.data,
        headers: config.headers,
      }
    );

    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor to log every API response and error
apiClient.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL || ''}${response.config.url || ''}`;
    console.log(
      `✅ [API Response] ${response.config.method?.toUpperCase()} ${fullUrl} [Status: ${response.status}]`,
      response.data
    );
    return response;
  },
  (error) => {
    const fullUrl = error.config ? `${error.config.baseURL || ''}${error.config.url || ''}` : 'Unknown URL';
    const status = error.response?.status ? `[Status: ${error.response.status}]` : '[Network Error]';
    console.error(
      `❌ [API Response Error] ${error.config?.method?.toUpperCase()} ${fullUrl} ${status}`,
      error.response?.data || error.message
    );
    
    // Handle expired/invalid tokens globally to prevent infinite redirect loops
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("bhli-auth");
        window.dispatchEvent(new Event("storage"));
        
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/login")) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath + window.location.search)}`;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

function formatFieldErrors(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;
  const messages: string[] = [];
  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (typeof value === "string") messages.push(value);
    else if (Array.isArray(value)) messages.push(...value.filter((item): item is string => typeof item === "string"));
    else {
      const nested = formatFieldErrors(value);
      if (nested) messages.push(nested);
    }
  }
  return messages.length ? messages.join(" | ") : null;
}
/**
 * Helper function to extract user-friendly error messages from API calls
 */
export function getErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (typeof error === 'string') return error;

  const directFieldError = formatFieldErrors(error.errors);
  if (directFieldError) return directFieldError;

  // Handle Axios response data
  if (error.response?.data) {
    const data = error.response.data;

    if (typeof data === 'string') return data;
    const responseFieldError = formatFieldErrors(data.errors);
    if (responseFieldError) return responseFieldError;
    if (data.message) return data.message;
    if (data.detail) return data.detail;
    if (data.error) return data.error;

    // Django REST Framework field-level errors
    if (typeof data === 'object') {
      const messages: string[] = [];
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          messages.push(`${key}: ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          messages.push(`${key}: ${value}`);
        }
      }
      if (messages.length > 0) return messages.join(' | ');
    }
  }

  // Handle standard Error object
  if (error.message) {
    if (error.message.includes('Network Error')) {
      return 'Network connection lost. Please check your internet connection or server status.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
