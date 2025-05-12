import api from '../axiosConfig';

export const createConteudo = async (conteudoData) => {
  try {
    const response = await api.post('/conteudo', conteudoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao criar conteúdo' };
  }
};

export const getConteudoById = async (id) => {
  try {
    const response = await api.get(`/conteudo/id/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao buscar conteúdo' };
  }
};

export const getAllConteudos = async () => {
  try {
    const response = await api.get('/conteudo/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao listar conteúdos' };
  }
};

export const updateConteudo = async (id, conteudoData) => {
  try {
    const response = await api.put(`/conteudo/${id}`, conteudoData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao atualizar conteúdo' };
  }
};

export const deleteConteudo = async (id) => {
  try {
    const response = await api.delete(`/conteudo/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao remover conteúdo' };
  }
};

export const getConteudosByAdmin = async (adminId) => {
  try {
    const response = await api.get(`/conteudo/admin/${adminId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Erro ao buscar conteúdos por administrador' };
  }
};