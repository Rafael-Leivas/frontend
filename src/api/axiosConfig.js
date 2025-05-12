import axios from 'axios';
import { getToken, removeToken } from './auth';

// Substitua por sua URL base real
const BASE_URL = 'http://localhost:3000'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        removeToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

export default api;