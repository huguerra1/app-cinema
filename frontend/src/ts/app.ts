import * as api from './apiService';

// ==========================================
// 1. ESTADO DE AUTENTICAÇÃO E ADMIN
// ==========================================
let isAdmin = false;
let currentUser: any = null;
try {
  if (api.getToken()) currentUser = JSON.parse(localStorage.getItem('cine_user') || 'null');
} catch {
  api.clearToken();
  localStorage.removeItem('cine_user');
}

function updateAuthState() {
  const userInfo = document.getElementById('user-info');
  const userNameDisplay = document.getElementById('user-name-display');
  const btnLogout = document.getElementById('btn-logout');
  const btnLoginNav = document.getElementById('btn-login-nav');
  const btnToggleAdmin = document.getElementById('btn-toggle-admin'); // Pegamos o botão de admin
  const pdvUsuarioNome = document.getElementById('pdv-usuario-nome') as HTMLInputElement;

  if (currentUser) {
    // 1. Usuário Logado: Mostra info e Logout
    userInfo?.classList.remove('d-none');
    btnLogout?.classList.remove('d-none');
    btnLoginNav?.classList.add('d-none');
    
    if (userNameDisplay) userNameDisplay.innerText = currentUser.name || 'Usuário';
    if (pdvUsuarioNome) pdvUsuarioNome.value = `${currentUser.name} (${currentUser.email})`;

    // O backend também verifica o papel em todas as escritas do catálogo.
    if (currentUser.profile === 'ADMIN') {
      btnToggleAdmin?.classList.remove('d-none'); // Mostra o botão se for Admin
    } else {
      btnToggleAdmin?.classList.add('d-none');    // Esconde se for User comum
      
      // Se ele era Admin, deslogou e entrou como User, 
      // precisamos garantir que o Modo Admin seja desligado
      isAdmin = false;
      const adminElements = document.querySelectorAll('.admin-only');
      adminElements.forEach(el => el.classList.add('d-none'));
    }

  } else {
    isAdmin = false;
    document.querySelectorAll('.admin-only').forEach(el => el.classList.add('d-none'));
    // 2. Deslogado: Esconde tudo e mostra Login
    userInfo?.classList.add('d-none');
    btnLogout?.classList.add('d-none');
    btnToggleAdmin?.classList.add('d-none'); // Esconde o botão admin se deslogado
    btnLoginNav?.classList.remove('d-none');
    if (pdvUsuarioNome) pdvUsuarioNome.value = '⚠️ Faça login primeiro para comprar!';
  }
}

// Logout
document.getElementById('btn-logout')?.addEventListener('click', () => {
  api.clearToken();
  localStorage.removeItem('cine_user');
  currentUser = null;
  updateAuthState();
  showAlert('Você saiu da conta.', 'info');
  document.querySelector('.nav-link[data-target="view-sessoes"]')?.dispatchEvent(new Event('click'));
});

window.addEventListener('auth-expired', () => {
  localStorage.removeItem('cine_user');
  currentUser = null;
  updateAuthState();
  document.querySelector('.nav-link[data-target="view-login"]')?.dispatchEvent(new Event('click'));
});

// Alterna o modo administrativo.
const btnToggleAdmin = document.getElementById('btn-toggle-admin');
const adminElements = document.querySelectorAll('.admin-only');
btnToggleAdmin?.addEventListener('click', () => {
  if (currentUser?.profile !== 'ADMIN' || !api.getToken()) return;
  isAdmin = !isAdmin;
  btnToggleAdmin.innerText = isAdmin ? 'Sair do Modo Admin' : 'Modo Admin';
  btnToggleAdmin.classList.toggle('btn-danger', isAdmin);
  btnToggleAdmin.classList.toggle('btn-outline-light', !isAdmin);
  adminElements.forEach(el => {
    if (!isAdmin || !el.classList.contains('view-section')) el.classList.toggle('d-none', !isAdmin);
  });
  document.querySelector('.nav-link[data-target="view-sessoes"]')?.dispatchEvent(new Event('click'));
});

// Navegação (SPA)
const navLinks = document.querySelectorAll('.nav-link[data-target]');
const viewSections = document.querySelectorAll('.view-section');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement; // Correção para pegar o elemento que tem o data-target
    const targetId = target.getAttribute('data-target');
    
    if(target.classList.contains('fw-bold') || target.classList.contains('nav-link')) {
        navLinks.forEach(nav => {
            if(!nav.id.includes('login') && !nav.id.includes('cadastro')) {
                nav.classList.remove('active', 'fw-bold');
            }
        });
    }
    
    target.classList.add('active', 'fw-bold');
    viewSections.forEach(section => section.id === targetId ? section.classList.remove('d-none') : section.classList.add('d-none'));
  });
});

function showAlert(message: string, type: string) {
  const container = document.getElementById('alert-container');
  if (container) {
    container.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show"><span></span><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
    container.querySelector('span')!.textContent = message;
    setTimeout(() => { container.innerHTML = ''; }, 4000);
  }
}

function escapeHtml(value: string) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

function populateSelect(selectElement: HTMLSelectElement, data: any[], labelField: string, valueField: string, customLabel?: (item: any) => string) {
  if (!selectElement) return;
  selectElement.innerHTML = `<option value="">Selecione...</option>`;
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item[valueField];
    option.textContent = customLabel ? customLabel(item) : item[labelField];
    selectElement.appendChild(option);
  });
}

// ==========================================
// 2. CARREGAR DADOS DA API
// ==========================================
async function loadDashboard() {
  try {
    const [filmes, sessoes, salas, lanches, generos] = await Promise.all([
      api.getFilmes().catch(()=>[]), api.getSessoes().catch(()=>[]), api.getSalas().catch(()=>[]), api.getLanches().catch(()=>[]), api.getGeneros().catch(()=>[])
    ]);

    const sessoesContainer = document.getElementById('sessoes-list');
    if (sessoesContainer) {
      sessoesContainer.innerHTML = sessoes.length ? sessoes.map((s: any) => `
        <div class="col-md-4 mb-3"><div class="card shadow-sm border-primary h-100"><div class="card-body">
          <h5 class="text-primary">🎬 ${escapeHtml(s.movie?.title || 'Filme')}</h5>
          <p><strong>Horário:</strong> ${new Date(s.startTime).toLocaleString('pt-BR')}</p>
          <p><strong>Preço:</strong> R$ ${Number(s.price).toFixed(2)}</p>
        </div></div></div>
      `).join('') : '<p>Nenhuma sessão cadastrada.</p>';
    }

    populateSelect(document.getElementById('filme-select') as HTMLSelectElement, filmes, 'title', 'id');
    populateSelect(document.getElementById('sala-select') as HTMLSelectElement, salas, 'name', 'id');
    populateSelect(document.getElementById('filme-genero') as HTMLSelectElement, generos, 'name', 'id');
    populateSelect(document.getElementById('pdv-combo') as HTMLSelectElement, lanches, 'name', 'id', l => `${l.name} - R$${l.price}`);
    populateSelect(document.getElementById('pdv-sessao') as HTMLSelectElement, sessoes, 'id', 'id', s => {
      const f = filmes.find((f:any) => f.id === s.movieId);
      return `${f?.title || 'Filme'} - ${new Date(s.startTime).toLocaleString('pt-BR')}`;
    });
    const sessionSelect = document.getElementById('pdv-sessao') as HTMLSelectElement;
    sessionSelect.onchange = () => {
      const session = sessoes.find((s: any) => s.id === sessionSelect.value);
      (document.getElementById('pdv-preco-ingresso') as HTMLInputElement).value = session ? String(session.price) : '';
    };
    sessionSelect.dispatchEvent(new Event('change'));
  } catch (error: any) { showAlert('Erro ao carregar: ' + error.message, 'danger'); }
}

// ==========================================
// 3. EVENTOS: AUTH E CADASTROS
// ==========================================

// Cadastro de Usuário
document.getElementById('form-cadastro')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api.createUsuario({
      name: (document.getElementById('cad-nome') as HTMLInputElement).value,
      email: (document.getElementById('cad-email') as HTMLInputElement).value,
      password: (document.getElementById('cad-senha') as HTMLInputElement).value
    });
    showAlert('Conta criada! Faça login.', 'success');
    (e.target as HTMLFormElement).reset();
    document.querySelector('.nav-link[data-target="view-login"]')?.dispatchEvent(new Event('click'));
  } catch (err: any) { showAlert('Erro: ' + err.message, 'danger'); }
});

// Login
document.getElementById('form-login')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = {
      email: (document.getElementById('login-email') as HTMLInputElement).value,
      password: (document.getElementById('login-senha') as HTMLInputElement).value
    };
    const userLogado = await api.loginUsuario(payload);
    
    localStorage.setItem('cine_user', JSON.stringify(userLogado));
    currentUser = userLogado;
    updateAuthState();
    
    showAlert('Login com sucesso!', 'success');
    (e.target as HTMLFormElement).reset();
    document.querySelector('.nav-link[data-target="view-sessoes"]')?.dispatchEvent(new Event('click'));
  } catch (err: any) { showAlert('Falha no login: ' + err.message, 'danger'); }
});

// Admin: Cadastros Básicos
document.getElementById('form-filme')?.addEventListener('submit', async (e) => { e.preventDefault(); try { const g = (document.getElementById('filme-genero') as HTMLSelectElement).value; if(!g) return showAlert('Selecione um Gênero!','warning'); await api.createFilme({ title: (document.getElementById('filme-titulo') as HTMLInputElement).value, durationMinutes: parseInt((document.getElementById('filme-duracao') as HTMLInputElement).value), synopsis: (document.getElementById('filme-sinopse') as HTMLInputElement).value, genreId: g }); showAlert('Filme salvo!', 'success'); (e.target as HTMLFormElement).reset(); loadDashboard(); } catch (err: any) { showAlert('Erro: ' + err.message, 'danger'); } });
document.getElementById('form-sala')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api.createSala({ name: (document.getElementById('sala-nome') as HTMLInputElement).value, capacity: parseInt((document.getElementById('sala-capacidade') as HTMLInputElement).value) }); showAlert('Sala salva!', 'success'); (e.target as HTMLFormElement).reset(); loadDashboard(); } catch (err: any) { showAlert(err.message, 'danger'); } });
document.getElementById('sessao-form')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api.createSessao({ startTime: new Date((document.getElementById('horario-inicio') as HTMLInputElement).value).toISOString(), movieId: (document.getElementById('filme-select') as HTMLSelectElement).value, roomId: (document.getElementById('sala-select') as HTMLSelectElement).value, price: Number((document.getElementById('sessao-preco') as HTMLInputElement).value) }); showAlert('Sessão agendada!', 'success'); (e.target as HTMLFormElement).reset(); loadDashboard(); } catch (err: any) { showAlert(err.message, 'danger'); } });
document.getElementById('form-lanche')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api.createLanche({ name: (document.getElementById('lanche-nome') as HTMLInputElement).value, price: parseFloat((document.getElementById('lanche-preco') as HTMLInputElement).value) }); showAlert('Combo adicionado!', 'success'); (e.target as HTMLFormElement).reset(); loadDashboard(); } catch (err: any) { showAlert(err.message, 'danger'); } });
document.getElementById('form-genero')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api.createGenero({ name: (document.getElementById('genero-nome') as HTMLInputElement).value }); showAlert('Gênero salvo!', 'success'); (e.target as HTMLFormElement).reset(); loadDashboard(); } catch (err: any) { showAlert(err.message, 'danger'); } });

// PDV: Finalizar Compra
document.getElementById('form-pedido')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return showAlert('⚠️ Você precisa fazer login antes de comprar!', 'danger');

  try {
    const snackComboId = (document.getElementById('pdv-combo') as HTMLSelectElement).value;
    const quantity = parseInt((document.getElementById('pdv-combo-qtd') as HTMLInputElement).value);
    const ticket = await api.createTicket({
      seat: (document.getElementById('pdv-assento') as HTMLInputElement).value,
      sessionId: (document.getElementById('pdv-sessao') as HTMLSelectElement).value,
    });
    await api.createPedido({ ticketIds: [ticket.id], snackCombos: snackComboId ? [{ snackComboId, quantity }] : [] });
    showAlert('✅ Pedido finalizado com sucesso!', 'success');
    (e.target as HTMLFormElement).reset();
    loadDashboard();
  } catch (err: any) { showAlert('Erro na venda: ' + err.message, 'danger'); }
});

window.addEventListener('DOMContentLoaded', () => { updateAuthState(); loadDashboard(); });
