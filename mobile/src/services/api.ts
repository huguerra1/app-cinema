import axios from 'axios';

const IP_DO_SEU_PC = '192.168.0.16'; // Exemplo

const api = axios.create({
  baseURL: `http://${IP_DO_SEU_PC}:3000/api`,
});

export default api; 