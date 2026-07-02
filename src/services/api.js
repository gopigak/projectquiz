import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  timeout: 15000,
});

let unauthorizedCallback = null;

export const registerUnauthorizedCallback = (callback) => {
  unauthorizedCallback = callback;
};

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (like token expiration)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config && (
      error.config.url.includes('/auth/login') || 
      error.config.url.includes('/auth/signup')
    );
    if (error.response && error.response.status === 401 && !isAuthRoute) {
      console.warn('Unauthorized access detected. Logging user out...');
      localStorage.removeItem('userInfo');
      if (unauthorizedCallback) {
        unauthorizedCallback();
      }
      // If client-side router is active, we can trigger redirection or reload
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
