# ROADMAP — app-cinema

**Status:** EM ANDAMENTO · Prioridade 4 no portfólio

## Checklist de "pronto"
- [ ] CI no GitHub Actions (lint + testes + build do backend e do frontend) verde
- [ ] Testes unitários dos services (orders, tickets, users) e e2e das rotas principais
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
4. Hash de senha e validação de DTOs revisados (class-validator em todos os endpoints)
5. Seeds do Prisma com filmes, salas e sessões de exemplo
6. Frontend web: URL da API via `VITE_API_URL` em vez de fixa em `apiService.ts`
7. Mobile: URL da API via variável do Expo em vez de IP fixo
8. Remover comentários de rascunho ("ADICIONE ESTA LINHA AQUI") e padronizar o lint
9. CI + deploy (ex.: Render para a API + Postgres, Vercel/Pages para o web)
10. Separar papéis (admin x cliente) e autenticar o painel web para proteger as escritas do catálogo (movies, genres, rooms, sessions, snack-combos). Até lá, essas rotas continuam públicas; as mutações de profile retornam 403, pois alteram papéis compartilhados.
11. Proteger a leitura, alteração e exclusão em users, remover password das respostas e impedir a escolha arbitrária de profileId no cadastro/edição. Hoje essas rotas públicas expõem senhas em texto puro e permitem assumir contas/papéis, mesmo com os guards nos recursos pessoais.
12. Revisar preço de ingresso recebido do cliente e consistência dos totais após alterações em tickets; reservar assentos e vincular ingressos a pedidos com transações/controle de concorrência. Ingressos ainda sem pedido não têm proprietário no modelo atual.

## Log
- 2026-11-09 — Fase 1: JWT_SECRET via ambiente, node_modules/dist fora do git, README corrigido, regras de autonomia.
- 2026-11-10 — Autenticação: guard JWT e CurrentUser, /order/me e rota legada com 403 para outro usuário; pedidos, ingressos comprados e endereços filtrados pelo token. Profile expõe somente o próprio papel, sem listar usuários; mutações bloqueadas até existir autorização administrativa. PATCH de pedidos rejeita alterações de itens, cuja implementação anterior era provisória e não recalculava totais. Mobile usa /order/me; frontend preservado.
- 2026-11-10 — Validação local: build aprovado; 67 testes unitários/HTTP e 28 de integração aprovados sem banco, com Prisma mockado. Jest executado com --runInBand porque o sandbox bloqueia processos paralelos (spawn EPERM). ESLint sem erros nos arquivos alterados; permanecem 48 erros de formatação e 1 aviso preexistentes nos demais arquivos. Status geral permanece EM ANDAMENTO; pendências de segurança registradas no backlog. Sem commit/push.
