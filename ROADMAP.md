# ROADMAP — app-cinema

**Status:** EM ANDAMENTO · Prioridade 4 no portfólio

## Checklist de "pronto"
- [x] CI verde: backend (build, unitários e e2e), banco com PostgreSQL real e frontend (build)
- [x] Ampliar testes dos demais services e rotas (catálogo, autenticação e recursos pessoais cobertos com Prisma mockado)
- [x] Senhas com scrypt e migração no login; respostas/JWT sem password
- [x] JWT, propriedade nas rotas pessoais e papéis ADMIN/USER
- [x] README com Docker, execução local, arquitetura e permissões
- [ ] Prints/GIF do web e do mobile no README
- [x] Segredos via ambiente e arquivos `.env.example`
- [x] URLs da API por variável no web e no mobile
- [x] Comentários de rascunho removidos
- [x] Seed idempotente de perfis, admin e catálogo de exemplo
- [x] Dependabot ativo (backend, frontend, mobile e Actions)
- [x] Repositório `crud` arquivado; histórico incorporado neste repositório
- [ ] Deploy público (API + web)
- [ ] Licença acordada com o colaborador

## Backlog
1. [x] JWT_SECRET via ambiente; node_modules/dist fora do versionamento.
2. [x] Incorporar histórico e arquivar `crud`.
3. [x] Proteger recursos pessoais por JWT e propriedade.
4. [x] Hash scrypt, migração no login e DTOs de users revisados.
5. [x] Seed idempotente: gêneros, filmes, salas, sessões e combos.
6. [x] URL web via VITE_API_URL.
7. [x] URL mobile via EXPO_PUBLIC_API_URL.
8. [x] Remover comentários de rascunho.
9. [x] CI verde com PostgreSQL real e Dependabot ativo.
10. [x] Papéis ADMIN/USER, bootstrap do admin e painel autenticado.
11. [x] Restringir users ao dono e impedir escolha de papel.
12. [x] Preço do ingresso calculado pelo servidor a partir da sessão.
13. [ ] Assentos e vinculação de ingressos com transações/controle de concorrência.
14. [ ] Propriedade de ingressos sem pedido; totais após editar/excluir tickets e preços em carrinhos antigos.
15. [x] Validar os demais DTOs e ampliar a cobertura de testes.
16. [ ] Padronizar lint no restante do código.
17. [ ] Deploy público, prints/GIF e licença com o colaborador.

## Log
- 2026-11-10 — DTOs e catálogo: ValidationPipe global com whitelist e transform, sem rejeitar campos extras e sem conversão implícita; payloads de mobile/src/screens e frontend/src/ts conferidos. price legado do ingresso e userId do pedido descartados; preço e propriedade continuam definidos pelo servidor. DTOs revisados com limites de texto, inteiros dentro do intervalo do PostgreSQL, preços positivos, datas estritas, UUIDs e validação aninhada; Update DTOs mantêm PartialType e validam null em campos obrigatórios do Create. Services movie, genre, room, session e snack-combo com testes de CRUD e 404 para registros inexistentes, inclusive antes de editar/remover; sessões também cobrem conflitos e horários adjacentes. Testes de DTOs cobrem entradas inválidas, campos extras, itens aninhados e compatibilidade dos clientes; e2e cobrem 400 como ADMIN, descarte de extras em POST/PATCH e 404 do catálogo. Validação aprovada no backend: npm run build; npx jest --runInBand (278 testes, 21 suítes); npx jest --config ./test/jest-e2e.json --runInBand (70 testes); npx eslint nos 38 arquivos TypeScript alterados (sem erros ou avisos); git diff --check. Sem banco, alterações em node_modules, prisma generate, commit ou push. Status permanece EM ANDAMENTO pelas demais pendências.
- 2026-11-10 — Validação do polimento: 125 testes em 15 suítes e 57 e2e aprovados via executáveis locais; ESLint nos três arquivos backend alterados sem erros, com um aviso preexistente em bootstrap(). npm/npx não localizou Jest/ESLint no workspace (ENOTCACHED); usada instalação local de C:/dev/app-cinema/node_modules por junction em backend/node_modules, sem rede. Build backend bloqueado por client Prisma desatualizado sem Session.price (3 erros); não foi regenerado. Frontend sem tsconfig.json: npx tsc --noEmit mostra ajuda; checagem com arquivos/opções explícitos aprovada. Vite build bloqueado por spawn EPERM. Seed validado com mocks; não executado contra PostgreSQL nesta execução. Limpeza de comentários conferida por equivalência do JavaScript transpilado; git diff --check aprovado. Sem commit/push.
- 2026-11-10 — Polimento: URL mobile por ambiente; comentários de rascunho removidos; seed com catálogo de exemplo idempotente e teste de reexecução; README com arquitetura, permissões e primeiros passos. CI verde e arquivamento de `crud` registrados conforme o estado informado; workflow de banco e Dependabot conferidos no código. Validação local registrada na entrada seguinte. Sem commit/push.
- 2026-11-10 — Papéis e preço: RolesGuard/@Roles em todas as escritas existentes do catálogo; GETs públicos; fallback de perfil pelo sub para JWT legado. Seed registrado no package.json e na configuração Prisma 7, sem alterar senhas/papéis de contas existentes; exemplos de ambiente e README atualizados. Login existente do painel corrigido para usar access_token/user, Bearer centralizado, logout e expiração; URL por VITE_API_URL. Session.price e migration PostgreSQL manual; preço de Ticket calculado pela sessão, inclusive proteção contra reprecificação no PATCH. PDV cria ingresso antes do pedido para calcular seu total; mobile usa preço da sessão no carrinho. Testes novos de papéis, rotas, seed e preço com Prisma mockado. Sem commit/push; status permanece EM ANDAMENTO.
- 2026-11-10 — Validação deste trabalho: dependências dos workspaces instaladas pelo cache offline. prisma generate falhou por ECONNREFUSED ao baixar schema-engine; sem client gerado, npm run build do backend falhou com erros de tipos Prisma e Jest teve 19 testes aprovados em 3 suítes, com 12 suítes bloqueadas por módulo .prisma/client/default ausente. E2E bloqueado pelo mesmo módulo (0 testes executados). ESLint executado somente nos TypeScript alterados do backend: 100 erros e 2 avisos de análise dependente de tipos Prisma, sem client gerado; sem erros restantes de formatação ou nos testes novos. Build do frontend falhou por spawn EPERM no Vite ao executar net use; checagem TypeScript do frontend aprovada. git diff --check aprovado. Migration e seed não executados contra banco; testes completos, lint e builds devem ser repetidos em ambiente com client gerado e permissão para os processos do Vite.
- 2026-11-10 — Segurança de users: hash e verificação com crypto nativo, migração de senha legada no login, filtro pelo token e remoção de password em todas as respostas. Mobile e frontend usam somente POST /users e POST /users/login; GET /users foi mantido com lista restrita ao próprio usuário, sem mudanças nos clientes. Nenhuma dependência ou migration adicionada. Senhas legadas de contas que não fizerem login continuam pendentes de migração; preço enviado pelo cliente e papéis admin/cliente para proteger escritas do catálogo continuam pendentes nos itens 12 e 10.
- 2026-11-10 — Validação de users: npm run build aprovado; npx jest --runInBand com 108 testes em 13 suítes aprovados; npx jest --config ./test/jest-e2e.json --runInBand com 33 testes aprovados; npx eslint somente nos arquivos TypeScript alterados sem erros ou avisos. Testes sem banco usando backend/src/prisma/prisma.mock.ts. Status permanece EM ANDAMENTO. Sem commit/push.
- 2026-11-09 — Fase 1: JWT_SECRET via ambiente, node_modules/dist fora do git, README corrigido, regras de autonomia.
- 2026-11-10 — Autenticação: guard JWT e CurrentUser, /order/me e rota legada com 403 para outro usuário; pedidos, ingressos comprados e endereços filtrados pelo token. Profile expõe somente o próprio papel, sem listar usuários; mutações bloqueadas até existir autorização administrativa. PATCH de pedidos rejeita alterações de itens, cuja implementação anterior era provisória e não recalculava totais. Mobile usa /order/me; frontend preservado.
- 2026-11-10 — Validação local: build aprovado; 67 testes unitários/HTTP e 28 de integração aprovados sem banco, com Prisma mockado. Jest executado com --runInBand porque o sandbox bloqueia processos paralelos (spawn EPERM). ESLint sem erros nos arquivos alterados; permanecem 48 erros de formatação e 1 aviso preexistentes nos demais arquivos. Status geral permanece EM ANDAMENTO; pendências de segurança registradas no backlog. Sem commit/push.
