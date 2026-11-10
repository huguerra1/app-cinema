BEGIN;

-- Impede novas escritas entre a verificação de duplicatas e a criação do índice.
LOCK TABLE "Ticket" IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "Ticket"
        GROUP BY "sessionId", "seat"
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Existem ingressos duplicados para (sessionId, seat). Revise os ingressos e pedidos antes de aplicar esta migration.'
            USING HINT = 'Localize os conflitos com: SELECT "sessionId", "seat", COUNT(*) FROM "Ticket" GROUP BY "sessionId", "seat" HAVING COUNT(*) > 1;';
    END IF;
END;
$$;

CREATE UNIQUE INDEX "Ticket_sessionId_seat_key" ON "Ticket"("sessionId", "seat");

COMMIT;
