import { seed } from '../../prisma/seed';
import { createPrismaMock } from '../prisma/prisma.mock';
import { verifyPassword } from './password';

// Mantém o estado entre execuções para verificar duplicações.
function mockRecords(delegate: ReturnType<typeof createPrismaMock>['movie']) {
  const records: { id: string; [key: string]: unknown }[] = [];
  const find = (where: object) =>
    records.find((record) =>
      Object.entries(where).every(([key, value]) => record[key] === value),
    );
  delegate.findFirst.mockImplementation(({ where }: { where: object }) =>
    Promise.resolve(find(where) ?? null),
  );
  delegate.create.mockImplementation(({ data }: { data: object }) => {
    const record = { ...data, id: String(records.length + 1) };
    records.push(record);
    return Promise.resolve(record);
  });
  delegate.upsert.mockImplementation(
    ({ where, create }: { where: object; create: object }) => {
      const existing = find(where);
      if (existing) return Promise.resolve(existing);
      const record = { ...create, id: String(records.length + 1) };
      records.push(record);
      return Promise.resolve(record);
    },
  );
  return records;
}

describe('Seed de perfis, admin e exemplos', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let database: Parameters<typeof seed>[0];
  const warn = jest.fn();

  beforeEach(() => {
    prisma = createPrismaMock();
    database = prisma as unknown as typeof database;
    warn.mockClear();
    for (const delegate of [
      prisma.genre,
      prisma.movie,
      prisma.room,
      prisma.session,
      prisma.snackCombo,
    ]) {
      mockRecords(delegate);
    }
    prisma.profile.create.mockImplementation(
      ({ data }: { data: { name: string } }) =>
        Promise.resolve({ id: data.name, name: data.name }),
    );
    prisma.user.upsert.mockImplementation(({ create }: { create: unknown }) =>
      Promise.resolve(create),
    );
  });

  it.each([
    {},
    { ADMIN_EMAIL: 'admin@example.com' },
    { ADMIN_PASSWORD: 'senha-do-admin' },
  ])(
    'cria perfis e exemplos sem admin com ambiente incompleto: %j',
    async (env) => {
      await seed(database, env, warn);
      expect(prisma.profile.create.mock.calls).toEqual([
        [{ data: { name: 'USER' } }],
        [{ data: { name: 'ADMIN' } }],
      ]);
      expect(prisma.user.upsert).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('admin não configurado'),
      );
    },
  );

  it('cria admin com hash e preserva contas e perfis na reexecução', async () => {
    const env = {
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'senha-do-admin',
    };
    await seed(database, env, warn);
    const args = (prisma.user.upsert.mock.calls as unknown[][])[0][0] as {
      where: { email: string };
      update: object;
      create: { profileId: string; password: string; email: string };
    };
    expect(args.where).toEqual({ email: env.ADMIN_EMAIL });
    expect(args.update).toEqual({});
    expect(args.create.profileId).toBe('ADMIN');
    expect(args.create.password).not.toBe(env.ADMIN_PASSWORD);
    await expect(
      verifyPassword(env.ADMIN_PASSWORD, args.create.password),
    ).resolves.toBe(true);
    prisma.profile.findFirst.mockImplementation(
      ({ where }: { where: { name: string } }) =>
        Promise.resolve({ id: where.name, name: where.name }),
    );
    prisma.profile.create.mockClear();
    prisma.user.upsert.mockResolvedValue(args.create);
    await seed(database, env, warn);
    expect(prisma.profile.create).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it('cria exemplos relacionados e preserva os dados na segunda execução', async () => {
    const genres = mockRecords(prisma.genre);
    const movies = mockRecords(prisma.movie);
    const rooms = mockRecords(prisma.room);
    const sessions = mockRecords(prisma.session);
    const combos = mockRecords(prisma.snackCombo);
    const before = Date.now();
    await seed(database, {}, warn);
    expect(genres).toHaveLength(3);
    expect(movies).toHaveLength(3);
    expect(rooms.map((room) => room.capacity)).toEqual([80, 120]);
    expect(sessions).toHaveLength(3);
    expect(combos.map((combo) => combo.price)).toEqual([22, 38, 55]);
    for (const movie of movies) {
      expect(genres.some((genre) => genre.id === movie.genreId)).toBe(true);
    }
    for (const session of sessions) {
      expect((session.startTime as Date).getTime()).toBeGreaterThan(before);
      expect(session.price).toBeGreaterThan(0);
      expect(movies.some((movie) => movie.id === session.movieId)).toBe(true);
      expect(rooms.some((room) => room.id === session.roomId)).toBe(true);
    }
    const snapshot = JSON.stringify({
      genres,
      movies,
      rooms,
      sessions,
      combos,
    });
    // Mesmo em outro dia, não desloca sessões existentes nem duplica exemplos.
    jest.useFakeTimers({ now: before + 7 * 24 * 60 * 60 * 1000 });
    try {
      await seed(database, {}, warn);
    } finally {
      jest.useRealTimers();
    }
    expect(JSON.stringify({ genres, movies, rooms, sessions, combos })).toBe(
      snapshot,
    );
    expect(prisma.movie.create).toHaveBeenCalledTimes(3);
    expect(prisma.room.create).toHaveBeenCalledTimes(2);
    expect(prisma.session.create).toHaveBeenCalledTimes(3);
    for (const delegate of [prisma.genre, prisma.snackCombo]) {
      for (const [args] of delegate.upsert.mock.calls as [
        { update: object },
      ][]) {
        expect(args.update).toEqual({});
      }
    }
  });

  it('não promove uma conta pública existente pelo email', async () => {
    prisma.user.upsert.mockResolvedValue({ profileId: 'USER' });
    await expect(
      seed(
        database,
        { ADMIN_EMAIL: 'cliente@example.com', ADMIN_PASSWORD: 'senha' },
        warn,
      ),
    ).rejects.toThrow('outro perfil');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
