// src/services/apiAdmin.js
import axios from 'axios';

const apiAdmin = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Adiciona interceptor para incluir token JWT no header Authorization
apiAdmin.interceptors.request.use(config => {
const token = localStorage.getItem('adminToken'); // ou outro local onde o token é armazenado
  if (token) {
    // Remove possíveis espaços em branco do token
    const trimmedToken = token.trim();
    config.headers.Authorization = `Bearer ${trimmedToken}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiAdmin;
