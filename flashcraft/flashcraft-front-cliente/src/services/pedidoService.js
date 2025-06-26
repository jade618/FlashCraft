import apiCliente from './apiCliente';

const pedidoService = {
  getCompras: async () => {
    const token = localStorage.getItem('token');
    const response = await apiCliente.get('/pedidosCliente', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getSolicitacoes3D: async () => {
    const response = await apiCliente.get('/solicitacoes3d/usuario');
    return response.data;
  },

  enviarPedidoPersonalizado: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await apiCliente.post('/solicitacoes3d', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getProdutos: async () => {
    const response = await apiCliente.get('/produtos');
    return response.data;
  },

  getProdutoById: async (id) => {
    const response = await apiCliente.get(`/produtos/${id}`);
    return response.data;
  }
};

export default pedidoService;
