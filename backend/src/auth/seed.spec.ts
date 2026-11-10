import type { PrismaClient } from '@prisma/client';
import { seed } from '../../prisma/seed';
import { createPrismaMock } from '../prisma/prisma.mock';
import { verifyPassword } from './password';

describe('Seed de perfis e admin', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let database: Pick<PrismaClient, 'profile' | 'user'>;
  const warn = jest.fn();

  beforeEach(() => {
    prisma = createPrismaMock();
    database = prisma as unknown as typeof database;
    warn.mockClear();
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
  ])('cria somente os perfis com ambiente incompleto: %j', async (env) => {
    await seed(database, env, warn);
    expect(prisma.profile.create.mock.calls).toEqual([
      [{ data: { name: 'USER' } }],
      [{ data: { name: 'ADMIN' } }],
    ]);
    expect(prisma.user.upsert).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('somente os perfis'),
    );
  });

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
