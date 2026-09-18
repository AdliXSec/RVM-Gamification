const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Extract the most useful error message from a Laravel API error response.
 * Priority: specific validation errors > top-level message > fallback.
 *
 * Laravel validation response format:
 *   { success: false, message: "Validasi gagal.", errors: { email: ["Email sudah terdaftar."] } }
 */
function extractErrorMessage(data: any): string {
  if (!data) return 'Terjadi kesalahan pada server.';

  // If there are specific validation errors, join them into a readable string
  if (data.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat() as string[];
    if (messages.length > 0) return messages.join(' ');
  }

  // Fallback to the top-level message (but skip the generic "Validasi gagal.")
  if (data.message && data.message !== 'Validasi gagal.') return data.message;

  return 'Terjadi kesalahan. Silakan coba lagi.';
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  } as Record<string, string>;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  let data = isJson ? await response.json() : null;

  // Flatten the Standard API Wrapper
  if (data && typeof data === 'object' && data.success === true && data.data !== undefined && data.data !== null) {
    data = { ...data.data, message: data.message };
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Only clear the token — do NOT do a full page reload.
      // React's ProtectedRoute will handle the redirect gracefully
      // without destroying the entire application state.
      localStorage.removeItem('token');
    }

    const error: any = new Error(extractErrorMessage(data));
    error.response = { data };
    error.status = response.status;
    throw error;
  }

  return { data, status: response.status };
}

export default {
  get: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body?: any, options?: RequestInit) => fetchApi(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body?: any, options?: RequestInit) => fetchApi(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: 'DELETE' }),
};
