import apiCliente from './apiCliente';

const agendamentoService = {
  getAgendamentos: async () => {
    const response = await apiCliente.get('/cabine');
    return response.data;
  },

  criarAgendamento: async (agendamentoData) => {
    const response = await apiCliente.post('/cabine', agendamentoData);
    return response.data;
  }
};

export default agendamentoService;
