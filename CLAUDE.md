# CLAUDE.md — app-cinema

Sistema fullstack de cinema: `backend/` (NestJS + Prisma + PostgreSQL), `frontend/` (React + Vite, servido por nginx) e `mobile/` (React Native + Expo).

## Comandos
- Backend: `cd backend && npm ci && npx prisma generate && npm run build` / `npm test` / `npm run lint`
- Tudo com Docker: `cp .env.example .env` e depois `docker compose up --build`

## Convenções
- Segredos sempre via variáveis de ambiente (`JWT_SECRET`, `DATABASE_URL`). Nunca commitar `.env`, `node_modules/` ou `dist/`.
- O repositório tem um colaborador (GabrielFonseca02): não reescreva o histórico nem a licença sem o aval dos dois.

## Regras de autonomia (agentes de IA)

Este repositório faz parte do plano de melhoria contínua do portfólio. O painel geral fica no repositório privado `portfolio-ops`.

1. **Branches:** todo trabalho acontece em `claude/<tema>`, com PRs pequenos e focados. O CI precisa estar verde antes do merge.
2. **Integração:** os PRs dos agentes entram na branch `dev`. A `main` só muda quando o dono revisar e aprovar o PR `dev → main`.
3. **Backlog:** o arquivo `ROADMAP.md` é a fonte da verdade. Atualize o status ao final de cada execução.
4. **Nunca:** apagar o repositório, mudar a visibilidade, commitar segredos (use `.env` + `.env.example`), reescrever o histórico da `main`, fazer force-push em branches que não são suas, ou adicionar serviços e dependências pagas. Esses pontos sempre voltam para o dono.
5. **Pronto:** quando o checklist de "pronto" do `ROADMAP.md` estiver completo, marque o status como **PRONTO PARA REVISÃO** e passe para o próximo repositório da fila no `portfolio-ops`.
6. **Commits:** mensagens em português, no imperativo, curtas e descritivas (nada de "atualização").
