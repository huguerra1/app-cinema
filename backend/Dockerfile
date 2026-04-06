# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Copy prisma schema and generate client
FROM deps AS prisma-generator
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma
RUN npx prisma generate

# Stage 3: Build the application
FROM prisma-generator AS builder
WORKDIR /usr/src/app
COPY --from=prisma-generator /usr/src/app/node_modules ./node_modules
COPY --from=prisma-generator /usr/src/app/prisma ./prisma
COPY . .
RUN npm run build

# Stage 4: Production image
FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000

# The command will first run migrations and then start the application.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
