// 📁 src/services/apiCliente.js

import axios from 'axios';

const apiCliente = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona interceptor para incluir token JWT no header Authorization
apiCliente.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // ou outro local onde o token é armazenado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiCliente;
