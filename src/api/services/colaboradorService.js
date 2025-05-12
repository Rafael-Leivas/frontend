import api from '../axiosConfig';

export const createColaborador = async (colaboradorData) => {
  try {
    const response = await api.post('/colaborador', colaboradorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao criar colaborador' };
  }
};

export const getColaboradorById = async (id) => {
  try {
    const response = await api.get(`/colaborador/id/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao buscar colaborador' };
  }
};

export const getAllColaboradores = async () => {
  try {
    const response = await api.get('/colaborador/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao listar colaboradores' };
  }
};

export const updateColaborador = async (id, colaboradorData) => {
  try {
    const response = await api.put(`/colaborador/${id}`, colaboradorData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao atualizar colaborador' };
  }
};

export const deleteColaborador = async (id) => {
  try {
    const response = await api.delete(`/colaborador/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao remover colaborador' };
  }
};