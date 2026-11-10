import axios from 'axios';

// No celular físico, use o IP da máquina que executa a API.
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
});

export default api;
