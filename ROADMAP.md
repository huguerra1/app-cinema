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
6. ~~Frontend web: URL da API via `VITE_API_URL` em vez de fixa em `apiService.ts`~~ — implementado em 2026-11-10, com `frontend/.env.example` e padrão `http://localhost:3000/api`.
7. Mobile: URL da API via variável do Expo em vez de IP fixo
8. Remover comentários de rascunho ("ADICIONE ESTA LINHA AQUI") e padronizar o lint
9. CI + deploy (ex.: Render para a API + Postgres, Vercel/Pages para o web)
10. ~~Separar papéis (admin x cliente) e autenticar o painel web para proteger as escritas do catálogo (movies, genres, rooms, sessions, snack-combos)~~ — implementado em 2026-11-10. GETs públicos; POST/PATCH/DELETE exigem JWT e ADMIN via RolesGuard/@Roles. Tokens sem role consultam o perfil no banco pelo sub. Seed idempotente de USER/ADMIN e admin por ADMIN_EMAIL/ADMIN_PASSWORD, com hash scrypt; painel persiste o token e envia Bearer. Mutações de profile continuam retornando 403. Validação completa pendente pelos limites do sandbox descritos no log.
11. ~~Proteger a leitura, alteração e exclusão em users, remover password das respostas e impedir a escolha arbitrária de profileId no cadastro/edição~~ — concluído em 2026-11-10. Somente POST /users e POST /users/login públicos; GET /users retorna apenas o próprio usuário em lista, GET /users/me usa o token, e GET/PATCH/DELETE /users/:id retornam 403 para outro id. Cadastro usa sempre USER; edição ignora profileId e conflitos de email retornam 409 pela restrição única do banco. Login inválido retorna 401 genérico; JWT contém sub, email e nome do perfil quando disponível, além de iat/exp.
12. ~~Revisar preço de ingresso recebido do cliente~~ — implementado em 2026-11-10: migration adiciona Session.price obrigatório com padrão 25; POST /ticket usa o preço da sessão e ignora price do corpo. PATCH ignora preço e impede trocar a sessão de ingresso comprado. Painel e mobile exibem o preço da sessão. Ainda pendentes: consistência dos totais após alterações/exclusões em tickets; reservar assentos e vincular ingressos a pedidos com transações/controle de concorrência; propriedade de ingressos ainda sem pedido; reconciliação de preços em carrinhos antigos. Aplicação da migration e validação completa pendentes em ambiente apropriado.

## Log
- 2026-11-10 — Papéis e preço: RolesGuard/@Roles em todas as escritas existentes do catálogo; GETs públicos; fallback de perfil pelo sub para JWT legado. Seed registrado no package.json e na configuração Prisma 7, sem alterar senhas/papéis de contas existentes; exemplos de ambiente e README atualizados. Login existente do painel corrigido para usar access_token/user, Bearer centralizado, logout e expiração; URL por VITE_API_URL. Session.price e migration PostgreSQL manual; preço de Ticket calculado pela sessão, inclusive proteção contra reprecificação no PATCH. PDV cria ingresso antes do pedido para calcular seu total; mobile usa preço da sessão no carrinho. Testes novos de papéis, rotas, seed e preço com Prisma mockado. Sem commit/push; status permanece EM ANDAMENTO.
- 2026-11-10 — Validação deste trabalho: dependências dos workspaces instaladas pelo cache offline. prisma generate falhou por ECONNREFUSED ao baixar schema-engine; sem client gerado, npm run build do backend falhou com erros de tipos Prisma e Jest teve 19 testes aprovados em 3 suítes, com 12 suítes bloqueadas por módulo .prisma/client/default ausente. E2E bloqueado pelo mesmo módulo (0 testes executados). ESLint executado somente nos TypeScript alterados do backend: 100 erros e 2 avisos de análise dependente de tipos Prisma, sem client gerado; sem erros restantes de formatação ou nos testes novos. Build do frontend falhou por spawn EPERM no Vite ao executar net use; checagem TypeScript do frontend aprovada. git diff --check aprovado. Migration e seed não executados contra banco; testes completos, lint e builds devem ser repetidos em ambiente com client gerado e permissão para os processos do Vite.
- 2026-11-10 — Segurança de users: hash e verificação com crypto nativo, migração de senha legada no login, filtro pelo token e remoção de password em todas as respostas. Mobile e frontend usam somente POST /users e POST /users/login; GET /users foi mantido com lista restrita ao próprio usuário, sem mudanças nos clientes. Nenhuma dependência ou migration adicionada. Senhas legadas de contas que não fizerem login continuam pendentes de migração; preço enviado pelo cliente e papéis admin/cliente para proteger escritas do catálogo continuam pendentes nos itens 12 e 10.
- 2026-11-10 — Validação de users: npm run build aprovado; npx jest --runInBand com 108 testes em 13 suítes aprovados; npx jest --config ./test/jest-e2e.json --runInBand com 33 testes aprovados; npx eslint somente nos arquivos TypeScript alterados sem erros ou avisos. Testes sem banco usando backend/src/prisma/prisma.mock.ts. Status permanece EM ANDAMENTO. Sem commit/push.
- 2026-11-09 — Fase 1: JWT_SECRET via ambiente, node_modules/dist fora do git, README corrigido, regras de autonomia.
- 2026-11-10 — Autenticação: guard JWT e CurrentUser, /order/me e rota legada com 403 para outro usuário; pedidos, ingressos comprados e endereços filtrados pelo token. Profile expõe somente o próprio papel, sem listar usuários; mutações bloqueadas até existir autorização administrativa. PATCH de pedidos rejeita alterações de itens, cuja implementação anterior era provisória e não recalculava totais. Mobile usa /order/me; frontend preservado.
- 2026-11-10 — Validação local: build aprovado; 67 testes unitários/HTTP e 28 de integração aprovados sem banco, com Prisma mockado. Jest executado com --runInBand porque o sandbox bloqueia processos paralelos (spawn EPERM). ESLint sem erros nos arquivos alterados; permanecem 48 erros de formatação e 1 aviso preexistentes nos demais arquivos. Status geral permanece EM ANDAMENTO; pendências de segurança registradas no backlog. Sem commit/push.
