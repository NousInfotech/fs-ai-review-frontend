import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
});

// Debug logging to help troubleshoot deployment issues
if (typeof window !== 'undefined') {
  console.log('API Base URL configured as:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000 (fallback)');
}

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Global error handler
  console.error('API Error:', {
    message: error.message,
    code: error.code,
    response: error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    } : 'No response',
    request: error.request ? 'Request made but no response' : 'No request',
  });
  if (error.response?.status === 401) {
    // Handle unauthorized
  }
  return Promise.reject(error);
});

export default api;
