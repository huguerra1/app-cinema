# 🎬 CineApp - Sistema de Venda de Ingressos e Bomboniere

Um sistema Fullstack completo para gerenciamento e venda de ingressos de cinema e lanches (bomboniere). O aplicativo permite que o usuário explore o catálogo de filmes, escolha sessões, adicione itens a um carrinho de compras local e finalize pedidos com segurança e histórico de compras.

---

## 🚀 Funcionalidades Principais

* **Autenticação JWT:** Login seguro com controle de sessão.
* **Catálogo de Filmes e Sessões:** Listagem dinâmica de filmes em cartaz integradas com salas e horários.
* **Bomboniere (Snacks):** Opção de compra de combos de lanches com controle de quantidade.
* **Carrinho Inteligente:** Carrinho de compras gerenciado no lado do cliente (`AsyncStorage`), otimizando chamadas ao backend e permitindo mesclar ingressos e lanches no mesmo pedido.
* **Histórico de Pedidos:** Tela exclusiva de "Meus Pedidos", listando o histórico detalhado de compras atrelado exclusivamente ao usuário logado.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi dividido em duas frentes, utilizando as melhores práticas do ecossistema JavaScript/TypeScript:

### 📱 Frontend (Mobile)
* **React Native & Expo:** Framework para desenvolvimento mobile cross-platform.
* **TypeScript:** Tipagem estática para maior segurança do código.
* **Axios:** Consumo eficiente da API REST.
* **AsyncStorage:** Armazenamento local seguro para o Token JWT e persistência do Carrinho de Compras.

### ⚙️ Backend (API)
* **NestJS:** Framework Node.js progressivo para construção de aplicações eficientes e escaláveis.
* **Prisma ORM:** Gerenciamento do banco de dados com tipagem forte e migrações automatizadas.
* **PostgreSQL:** Banco de dados relacional robusto.
* **Swagger:** Documentação automatizada das rotas da API.

---

## 📦 Como rodar o projeto localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) e o [PostgreSQL](https://www.postgresql.org/) instalados em sua máquina. O aplicativo mobile requer o aplicativo [Expo Go](https://expo.dev/client) no seu celular ou um emulador configurado.

### 1. Clonando o repositório
```bash
git clone https://github.com/huguerra1/app-cinema.git
cd app-cinema
```

### Opção A — Tudo com Docker (banco + API + web)
```bash
cp .env.example .env   # defina JWT_SECRET
docker compose up --build
```
A API fica em `http://localhost:3000/api` (Swagger no mesmo endereço) e o front web em `http://localhost:8080`.

### Opção B — Rodando cada parte

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # ajuste DATABASE_URL e defina JWT_SECRET
npx prisma migrate dev
npm run start:dev
```

**Mobile**
```bash
cd mobile
npm install
# Altere a baseURL em src/services/api.ts para o IP da sua máquina
npx expo start
```
Depois de iniciar o Expo, escaneie o QR Code com o aplicativo Expo Go no celular.

## 🏗️ Modelagem do banco de dados (resumo)
A arquitetura do banco foi desenhada para refletir um ambiente real de e-commerce e cinema:

- **Identidade e segurança:** User, Profile e Address
- **Domínio do cinema:** Movie, Genre, Room e Session
- **Vendas:** Ticket, SnackCombo, Order e SnackCombosOnOrders (relacionamento N:M)

Feito com dedicação por Hugo Fonseca Mourão 👨‍💻
