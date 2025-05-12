import api from '../axiosConfig';

export const createAdmin = async (adminData) => {
  try {
    const response = await api.post('/administrador', adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao criar administrador' };
  }
};

export const getAdminById = async (id) => {
  try {
    const response = await api.get(`/administrador/id/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao buscar administrador' };
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await api.get('/administrador/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao listar administradores' };
  }
};

export const updateAdmin = async (id, adminData) => {
  try {
    const response = await api.put(`/administrador/${id}`, adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao atualizar administrador' };
  }
};

export const deleteAdmin = async (id) => {
  try {
    const response = await api.delete(`/administrador/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao remover administrador' };
  }
};  