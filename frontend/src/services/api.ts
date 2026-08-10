import axios from 'axios';

/**
 * Axios instance configured with relative base URL.
 * Requests go through Vite proxy (configured in vite.config.ts) to reach FastAPI backend.
 * Vite proxy forwards /api/* to http://localhost:8000
 */
export const api = axios.create({
  baseURL: '/',  // Relative - uses Vite dev server origin
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Health check API calls.
 */
export const healthApi = {
  /**
   * Check backend health status.
   * @returns Promise resolving to health response
   */
  check: async () => {
    const response = await api.get<{ status: string }>('/api/v1/health');
    return response.data;
  },
};