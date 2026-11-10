-- Adiciona o preço da sessão e preenche as sessões existentes com 25.
ALTER TABLE "Session" ADD COLUMN "price" DOUBLE PRECISION NOT NULL DEFAULT 25;
