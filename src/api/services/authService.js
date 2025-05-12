import api from '../axiosConfig';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao fazer login' };
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/check');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao verificar autenticação' };
  }
};

export const logout = () => {
  // Limpeza do token é feita no frontend
  return Promise.resolve();
};