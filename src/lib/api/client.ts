import axios from 'axios';

const BASE_URL = 'https://bhli-backend.onrender.com';
let apiRequestSequence = 0;
let refreshRequest: Promise<{ access: string; refresh?: string }> | null = null;

export const API_ERROR_EVENT = 'bhli:api-error';

export interface ApiErrorEventDetail {
  message: string;
  status: number;
  title: string;
}

export function showApiError(error: unknown) {
  if (typeof window === 'undefined' || axios.isCancel(error)) return;
  const apiError = error as { response?: { status?: number } };
  const status = Number(apiError.response?.status || 0);
  const title = status === 0
    ? 'Connection problem'
    : status === 401
      ? 'Session expired'
      : status === 403
        ? 'Permission denied'
        : status === 404
          ? 'Information not found'
          : status === 429
            ? 'Too many requests'
            : status >= 500
              ? 'Service temporarily unavailable'
              : 'Please check your request';

  window.dispatchEvent(new CustomEvent<ApiErrorEventDetail>(API_ERROR_EVENT, {
    detail: { message: getErrorMessage(error), status, title },
  }));
}

export async function showFetchError(response: Response) {
  let data: unknown = null;
  try {
    data = await response.clone().json();
  } catch {
    try { data = await response.clone().text(); } catch { /* use the HTTP fallback below */ }
  }
  showApiError({
    response: { status: response.status, data },
    message: `Request failed with status ${response.status}.`,
  });
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function clearWebsiteSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('access_token');
  window.localStorage.removeItem('refresh_token');
  window.localStorage.removeItem('bhli-auth');
  window.dispatchEvent(new Event('storage'));
}

export function refreshAccessToken(refreshOverride?: string): Promise<{ access: string; refresh?: string }> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Token refresh is only available in the browser.'));
  const refresh = refreshOverride || window.localStorage.getItem('refresh_token');
  if (!refresh) return Promise.reject(new Error('No refresh token is available.'));

  if (!refreshRequest) {
    refreshRequest = axios
      .post(`${BASE_URL}/api/accounts/auth/token/refresh/`, { refresh }, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      })
      .then((response) => {
        const payload = response.data?.data ?? response.data;
        const access = payload?.access;
        const rotatedRefresh = payload?.refresh;
        if (!access || typeof access !== 'string') throw new Error('The refresh endpoint did not return an access token.');
        window.localStorage.setItem('access_token', access);
        if (rotatedRefresh && typeof rotatedRefresh === 'string') window.localStorage.setItem('refresh_token', rotatedRefresh);
        window.dispatchEvent(new Event('storage'));
        return { access, refresh: typeof rotatedRefresh === 'string' ? rotatedRefresh : undefined };
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

// Request interceptor to add the JWT token to headers and log every API hit
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage if in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const fullUrl = config.url?.startsWith('http') ? config.url : `${config.baseURL || ''}${config.url || ''}`;
    const requestNumber = ++apiRequestSequence;
    console.log(`[API ${requestNumber}] ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log(
      `🚀 [API Request] ${config.method?.toUpperCase()} ${fullUrl}`,
      {
        params: config.params,
        data: config.data,
      }
    );

    if (typeof window !== 'undefined') window.dispatchEvent(new Event('bhli:network-start'));
    return config;
  },
  (error) => {
    console.warn('[API Request Error]', error);
    showApiError(error);
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
    if (response.data && typeof response.data === 'object' && response.data.success === false) {
      showApiError({ response: { status: response.status, data: response.data } });
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('bhli:network-end'));
    return response;
  },
  async (error) => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('bhli:network-end'));
    const fullUrl = error.config ? `${error.config.baseURL || ''}${error.config.url || ''}` : 'Unknown URL';
    const status = error.response?.status ? `[Status: ${error.response.status}]` : '[Network Error]';
    const responseData = error.response?.data;
    const responseDetail = responseData?.errors?.detail || responseData?.detail;
    const isEmptySearchPage =
      error.response?.status === 404 && responseDetail === 'Invalid page.';

    const isHandledServiceFailure =
      error.config?.method?.toLowerCase() === 'get' &&
      error.response?.status >= 500 &&
      error.config?.url?.startsWith('/api/base/services/');

    // Logging out is idempotent: an expired/revoked refresh token means there is
    // no server session left to invalidate, so this is an expected response.
    const isInactiveLogoutSession =
      error.config?.method?.toLowerCase() === 'post' &&
      error.response?.status === 400 &&
      error.config?.url?.includes('/api/accounts/auth/logout/');

    const isRejectedRefreshToken =
      error.config?.method?.toLowerCase() === 'post' &&
      error.response?.status === 401 &&
      error.config?.url?.includes('/api/accounts/auth/token/refresh/');

    if (!isEmptySearchPage && !isHandledServiceFailure && !isInactiveLogoutSession && !isRejectedRefreshToken) {
      console.warn(
      `❌ [API Response Error] ${error.config?.method?.toUpperCase()} ${fullUrl} ${status}`,
      error.response?.data || error.message
    );
    }
    
    // Refresh an expired access token once, then replay the original request.
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isCrmRequest = error.config?.url?.includes('/api/crm/');
      if (isCrmRequest) {
        showApiError(error);
        window.localStorage.removeItem('crm_access_token');
        window.localStorage.removeItem('crm_refresh_token');
        if (!window.location.pathname.startsWith('/admin/login')) window.location.href = '/admin/login';
        return Promise.reject(error);
      }
      const originalRequest = error.config as typeof error.config & { _retry?: boolean };
      const isAuthRequest = originalRequest?.url?.includes('/api/accounts/auth/');
      const currentAccess = window.localStorage.getItem('access_token');
      const sentAuthorization = String(originalRequest?.headers?.Authorization || '');

      // Another request may already have refreshed the session. Replay with the
      // newer stored access token instead of rotating the refresh token again.
      if (!isAuthRequest && !originalRequest?._retry && currentAccess && sentAuthorization !== `Bearer ${currentAccess}`) {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${currentAccess}`;
        return apiClient(originalRequest);
      }

      const refresh = window.localStorage.getItem('refresh_token');
      if (refresh && !isAuthRequest && !originalRequest?._retry) {
        originalRequest._retry = true;
        try {
          const tokens = await refreshAccessToken(refresh);
          originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
          return apiClient(originalRequest);
        } catch {
          // Fall through and clear the invalid session.
        }
      }

      if (typeof window !== "undefined") {
        showApiError(error);
        clearWebsiteSession();
        
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/login")) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath + window.location.search)}`;
        }
      }
    }

    if (error.response?.status !== 401 && !isEmptySearchPage && !isInactiveLogoutSession) {
      showApiError(error);
    }
    
    return Promise.reject(error);
  }
);

function formatFieldErrors(errors: unknown, path = ""): string | null {
  if (!errors || typeof errors !== "object") return null;
  const messages: string[] = [];
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    const fieldPath = path ? `${path}.${key}` : key;
    if (typeof value === "string") messages.push(`${fieldPath}: ${value}`);
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "string") messages.push(`${fieldPath}: ${item}`);
        else {
          const nested = formatFieldErrors(item, `${fieldPath}[${index}]`);
          if (nested) messages.push(nested);
        }
      });
    } else {
      const nested = formatFieldErrors(value, fieldPath);
      if (nested) messages.push(nested);
    }
  }
  return messages.length ? messages.join(" | ") : null;
}
/**
 * Helper function to extract user-friendly error messages from API calls
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (typeof error === 'string') return error;

  const apiError = error as {
    errors?: unknown;
    response?: { data?: unknown };
    message?: unknown;
  };

  const directFieldError = formatFieldErrors(apiError.errors);
  if (directFieldError) return directFieldError;

  // Handle Axios response data
  if (apiError.response?.data) {
    const data = apiError.response.data;

    if (typeof data === 'string') return data;
    const responseObject = data as Record<string, unknown>;
    const responseFieldError = formatFieldErrors(responseObject.errors);
    if (responseFieldError) return responseFieldError;
    if (typeof responseObject.message === 'string') return responseObject.message;
    if (typeof responseObject.detail === 'string') return responseObject.detail;
    if (typeof responseObject.error === 'string') return responseObject.error;

    // Django REST Framework field-level errors
    if (typeof data === 'object') {
      const messages: string[] = [];
      for (const [key, value] of Object.entries(responseObject)) {
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
  if (typeof apiError.message === 'string') {
    if (apiError.message.includes('Network Error')) {
      return 'Network connection lost. Please check your internet connection or server status.';
    }
    return apiError.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
