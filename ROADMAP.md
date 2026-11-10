# ROADMAP — app-cinema

**Status:** EM ANDAMENTO · Prioridade 4 no portfólio

## Checklist de "pronto"
- [ ] CI no GitHub Actions (lint + testes + build do backend e do frontend) verde
- [ ] Testes unitários dos services (orders, tickets, users) e e2e das rotas principais — autenticação e recursos pessoais cobertos com Prisma mockado; ampliar a cobertura do restante da API
- [x] Senhas com scrypt nativo e migração no login; respostas e JWT sem password
- [x] Rotas pessoais de users protegidas por JWT e propriedade; cadastro/edição sem escolha de papel
- [x] README com como rodar (Docker e local)
- [ ] README com prints/GIF do web e do mobile e diagrama da arquitetura
- [x] Sem segredos no código; `.env.example` documentado
- [ ] Dependabot ativo
- [ ] Deploy público (API + web)
- [ ] Licença definida em acordo com o colaborador

## Backlog
1. ~~Tirar o segredo JWT do código~~ e ~~remover node_modules/dist do versionamento~~ (fase 1)
2. Incorporar o que ainda for útil do repositório `crud` (versão anterior) e depois arquivá-lo
3. ~~Guards de autorização: um usuário só vê os próprios pedidos (testes cobrindo isso)~~ — concluído em 2026-11-10; JWT obrigatório em order, ticket, profile e address, com filtros de propriedade.
4. ~~Hash de senha~~ — concluído em 2026-11-10 com `node:crypto` (scrypt, salt aleatório de 16 bytes e timingSafeEqual), inclusive na troca de senha e na migração transparente de senhas legadas após login válido. DTOs de cadastro/login/edição de users revisados; permanece pendente revisar a validação nos demais endpoints.
5. Seeds do Prisma com filmes, salas e sessões de exemplo
6. Frontend web: URL da API via `VITE_API_URL` em vez de fixa em `apiService.ts`
7. Mobile: URL da API via variável do Expo em vez de IP fixo
8. Remover comentários de rascunho ("ADICIONE ESTA LINHA AQUI") e padronizar o lint
9. CI + deploy (ex.: Render para a API + Postgres, Vercel/Pages para o web)
10. Separar papéis (admin x cliente) e autenticar o painel web para proteger as escritas do catálogo (movies, genres, rooms, sessions, snack-combos). Até lá, essas rotas continuam públicas; as mutações de profile retornam 403, pois alteram papéis compartilhados.
11. ~~Proteger a leitura, alteração e exclusão em users, remover password das respostas e impedir a escolha arbitrária de profileId no cadastro/edição~~ — concluído em 2026-11-10. Somente POST /users e POST /users/login públicos; GET /users retorna apenas o próprio usuário em lista, GET /users/me usa o token, e GET/PATCH/DELETE /users/:id retornam 403 para outro id. Cadastro usa sempre USER; edição ignora profileId e conflitos de email retornam 409 pela restrição única do banco. Login inválido retorna 401 genérico; JWT contém sub, email e nome do perfil quando disponível, além de iat/exp.
12. Revisar preço de ingresso recebido do cliente e consistência dos totais após alterações em tickets; Session ainda não tem preço no schema, portanto calcular o preço no servidor exige migration. Reservar assentos e vincular ingressos a pedidos com transações/controle de concorrência. Ingressos ainda sem pedido não têm proprietário no modelo atual.

## Log
- 2026-11-10 — Segurança de users: hash e verificação com crypto nativo, migração de senha legada no login, filtro pelo token e remoção de password em todas as respostas. Mobile e frontend usam somente POST /users e POST /users/login; GET /users foi mantido com lista restrita ao próprio usuário, sem mudanças nos clientes. Nenhuma dependência ou migration adicionada. Senhas legadas de contas que não fizerem login continuam pendentes de migração; preço enviado pelo cliente e papéis admin/cliente para proteger escritas do catálogo continuam pendentes nos itens 12 e 10.
- 2026-11-10 — Validação de users: npm run build aprovado; npx jest --runInBand com 108 testes em 13 suítes aprovados; npx jest --config ./test/jest-e2e.json --runInBand com 33 testes aprovados; npx eslint somente nos arquivos TypeScript alterados sem erros ou avisos. Testes sem banco usando backend/src/prisma/prisma.mock.ts. Status permanece EM ANDAMENTO. Sem commit/push.
- 2026-11-09 — Fase 1: JWT_SECRET via ambiente, node_modules/dist fora do git, README corrigido, regras de autonomia.
- 2026-11-10 — Autenticação: guard JWT e CurrentUser, /order/me e rota legada com 403 para outro usuário; pedidos, ingressos comprados e endereços filtrados pelo token. Profile expõe somente o próprio papel, sem listar usuários; mutações bloqueadas até existir autorização administrativa. PATCH de pedidos rejeita alterações de itens, cuja implementação anterior era provisória e não recalculava totais. Mobile usa /order/me; frontend preservado.
- 2026-11-10 — Validação local: build aprovado; 67 testes unitários/HTTP e 28 de integração aprovados sem banco, com Prisma mockado. Jest executado com --runInBand porque o sandbox bloqueia processos paralelos (spawn EPERM). ESLint sem erros nos arquivos alterados; permanecem 48 erros de formatação e 1 aviso preexistentes nos demais arquivos. Status geral permanece EM ANDAMENTO; pendências de segurança registradas no backlog. Sem commit/push.
