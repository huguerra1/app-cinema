import 'dotenv/config';
import type { PrismaClient } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { hashPassword } from '../src/auth/password';

export async function seed(
  prisma: Pick<
    PrismaClient,
    'profile' | 'user' | 'genre' | 'movie' | 'room' | 'session' | 'snackCombo'
  >,
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

  await seedExamples(prisma);

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    warn(
      'ADMIN_EMAIL e ADMIN_PASSWORD ausentes ou incompletos; perfis e dados de exemplo criados; admin não configurado.',
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

async function seedExamples(
  prisma: Pick<
    PrismaClient,
    'genre' | 'movie' | 'room' | 'session' | 'snackCombo'
  >,
) {
  const genres: Record<string, string> = {};
  for (const name of ['Aventura', 'Animação', 'Drama']) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    genres[name] = genre.id;
  }

  const rooms: string[] = [];
  for (const data of [
    { name: 'Sala 1', capacity: 80 },
    { name: 'Sala 2', capacity: 120 },
  ]) {
    const room =
      (await prisma.room.findFirst({ where: { name: data.name } })) ??
      (await prisma.room.create({ data }));
    rooms.push(room.id);
  }

  const movies = [
    {
      title: 'Além das Estrelas',
      durationMinutes: 110,
      synopsis: 'Uma tripulação explora um novo planeta.',
      genreId: genres.Aventura,
    },
    {
      title: 'O Bosque Encantado',
      durationMinutes: 90,
      synopsis: 'Dois amigos protegem uma floresta mágica.',
      genreId: genres['Animação'],
    },
    {
      title: 'Um Novo Caminho',
      durationMinutes: 105,
      synopsis: 'Uma musicista retorna à cidade natal para recomeçar.',
      genreId: genres.Drama,
    },
  ];
  for (const [index, data] of movies.entries()) {
    const movie =
      (await prisma.movie.findFirst({ where: { title: data.title } })) ??
      (await prisma.movie.create({ data }));
    const roomId = rooms[index % rooms.length];
    // Reutiliza a sessão do filme na sala sem alterar horários ou vendas existentes.
    const existing = await prisma.session.findFirst({
      where: { movieId: movie.id, roomId },
    });
    if (!existing) {
      const startTime = new Date();
      startTime.setUTCDate(startTime.getUTCDate() + index + 1);
      startTime.setUTCHours(21, 0, 0, 0);
      await prisma.session.create({
        data: { movieId: movie.id, roomId, startTime, price: 25 + index * 5 },
      });
    }
  }

  for (const data of [
    { name: 'Combo Individual', price: 22 },
    { name: 'Combo Dupla', price: 38 },
    { name: 'Combo Família', price: 55 },
  ]) {
    await prisma.snackCombo.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
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
