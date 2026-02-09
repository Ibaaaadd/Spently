import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/login');
      const isRegisterRequest = error.config?.url?.includes('/register');
      const isOnAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      const hasToken = localStorage.getItem('token');
      
      if (!isLoginRequest && !isRegisterRequest && !isOnAuthPage && hasToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const exportExpenses = (params) => api.get('/expenses/export', { 
  params,
  responseType: 'blob'
});

export const getSummary = (month, year) => 
  api.get('/expenses/summary', { params: { month, year } });

export const getYearlySummary = (year) => 
  api.get('/expenses/yearly-summary', { params: { year } });

export default api;
