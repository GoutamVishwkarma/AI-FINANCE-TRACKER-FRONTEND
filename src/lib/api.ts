import axios from 'axios';

const API_BASE_URL = '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage') as string).state.token
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (fullName: string, email: string, password: string, profileImageUrl?: string) => {
    const response = await api.post('/auth/register', { 
      fullName, 
      email, 
      password,
      profileImageUrl: profileImageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName)
    });
    return response.data;
  },
};

export const expenseApi = {
  getAll: async () => {
    const response = await api.get('/expense/get');
    return response.data;
  },
  add: async (data: { icon: string; category: string; amount: number; date: string }) => {
    const response = await api.post('/expense/add', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/expense/${id}`);
    return response.data;
  },
  downloadExcel: async () => {
    const response = await api.post('/expense/download-excel', {}, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const incomeApi = {
  getAll: async () => {
    const response = await api.get('/income/get');
    return response.data;
  },
  add: async (data: { icon: string; source: string; amount: number; date: string }) => {
    const response = await api.post('/income/add', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/income/${id}`);
    return response.data;
  },
  downloadExcel: async () => {
    const response = await api.post('/income/download-excel', {}, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const dashboardApi = {
  getSummary: async () => {
    // Base api instance already prefixes with /api/v1
    const response = await api.get('/dashboard');
    return response.data;
  },
};

export default api;
