
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object') return response;
    return Promise.reject({ message: 'Invalid response format', response });
  },
  async (error) => {
    const originalRequest = error.config || {};
    if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_BASE}/auth/refresh-token`, {}, { withCredentials: true });
        const newToken = res?.data?.token;
        if (newToken) {
          if (typeof window !== 'undefined') localStorage.setItem('accessToken', newToken);
          apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${newToken}` };
          return apiClient(originalRequest);
        }
      } catch (e) {}
    }
    if (error.response && error.response.data && error.response.data.message) return Promise.reject(new Error(error.response.data.message));
    return Promise.reject(error);
  }
);
