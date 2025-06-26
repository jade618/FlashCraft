import api from './api';

export const listarProdutos = async () => {
  const res = await api.get('/produtos');
  return res.data;
};

export const buscarProdutoPorId = async (id) => {
  const res = await api.get(`/produtos/${id}`);
  return res.data;
};
