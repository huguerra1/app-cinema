import 'dotenv/config';
import type { PrismaClient } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { hashPassword } from '../src/auth/password';

export async function seed(
  prisma: Pick<PrismaClient, 'profile' | 'user'>,
  env: NodeJS.ProcessEnv = process.env,
  warn: (message: string) => void = console.warn,
) {
  // Profile.name ainda não é único no modelo; reutiliza os perfis existentes.
  const profiles: Record<string, string> = {};
  for (const name of ['USER', 'ADMIN']) {
    const profile =
      (await prisma.profile.findFirst({ where: { name } })) ??
      (await prisma.profile.create({ data: { name } }));
    profiles[name] = profile.id;
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    warn(
      'ADMIN_EMAIL e ADMIN_PASSWORD ausentes ou incompletos; somente os perfis foram criados.',
    );
    return;
  }

  const account = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    // Reexecuções preservam a senha e o papel de contas existentes.
    update: {},
    create: {
      email: ADMIN_EMAIL,
      name: 'Administrador',
      password: await hashPassword(ADMIN_PASSWORD),
      profileId: profiles.ADMIN,
    },
  });
  if (account.profileId !== profiles.ADMIN) {
    throw new Error(
      'ADMIN_EMAIL já pertence a uma conta de outro perfil. Use um email exclusivo para o admin.',
    );
  }
}

async function main() {
  const prisma = new PrismaService();
  try {
    await seed(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch(() => {
    // Não exibe dados da conexão nem credenciais em caso de falha.
    console.error(
      'Falha no seed. Confira a conexão, as migrations e se ADMIN_EMAIL já pertence a outro perfil.',
    );
    process.exitCode = 1;
  });
}
