const BASE_URL = 'http://localhost:3000/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}/${endpoint}`;
  options.headers = { 'Content-Type': 'application/json', ...options.headers };
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Erro HTTP: ${response.status}`;
    throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
  }
  
  const text = await response.text();
  return text ? JSON.parse(text) : {}; 
}

// BUSCAS (GET)
export const getGeneros = () => request('genre');
export const getFilmes = () => request('movie');
export const getSalas = () => request('room');
export const getSessoes = () => request('session');
export const getLanches = () => request('snack-combo');
export const getPedidos = () => request('order');

// CADASTROS (POST)
export const createGenero = (data: any) => request('genre', { method: 'POST', body: JSON.stringify(data) });
export const createFilme = (data: any) => request('movie', { method: 'POST', body: JSON.stringify(data) });
export const createSala = (data: any) => request('room', { method: 'POST', body: JSON.stringify(data) }); 
export const createSessao = (data: any) => request('session', { method: 'POST', body: JSON.stringify(data) });
export const createLanche = (data: any) => request('snack-combo', { method: 'POST', body: JSON.stringify(data) });
export const createTicket = (data: any) => request('ticket', { method: 'POST', body: JSON.stringify(data) });
export const createPedido = (data: any) => request('order', { method: 'POST', body: JSON.stringify(data) });

// AUTENTICAÇÃO E USUÁRIO (O atalho que fizemos no seu backend)
export const createUsuario = (data: any) => request('users', { method: 'POST', body: JSON.stringify(data) });
export const loginUsuario = (data: any) => request('users/login', { method: 'POST', body: JSON.stringify(data) });