import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ajuste para o endereço real da sua API
});

export default api;
