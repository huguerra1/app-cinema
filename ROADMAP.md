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
3. Guards de autorização: um usuário só vê os próprios pedidos (testes cobrindo isso)
4. Hash de senha e validação de DTOs revisados (class-validator em todos os endpoints)
5. Seeds do Prisma com filmes, salas e sessões de exemplo
6. Frontend web: URL da API via `VITE_API_URL` em vez de fixa em `apiService.ts`
7. Mobile: URL da API via variável do Expo em vez de IP fixo
8. Remover comentários de rascunho ("ADICIONE ESTA LINHA AQUI") e padronizar o lint
9. CI + deploy (ex.: Render para a API + Postgres, Vercel/Pages para o web)

## Log
- 2026-11-09 — Fase 1: JWT_SECRET via ambiente, node_modules/dist fora do git, README corrigido, regras de autonomia.
