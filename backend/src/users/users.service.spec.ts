import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';
import { hashPassword, verifyPassword } from '../auth/password';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: ReturnType<typeof createPrismaMock>;
  const user = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Cliente',
    email: 'cliente@example.com',
    password: 'senha-de-teste',
    profileId: 'perfil-cliente',
    profile: { name: 'USER' },
  };
  const { password, ...publicUser } = user;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(UsersService);
  });

  it('cadastra com hash, ignora profileId e campos extras, sem devolver a senha', async () => {
    prisma.profile.findFirst.mockResolvedValue({ id: user.profileId });
    prisma.user.create.mockResolvedValue(user);
    const dto = { ...user, profileId: 'admin', orders: [] };
    await expect(service.create(dto)).resolves.toEqual(publicUser);
    expect(prisma.profile.findFirst).toHaveBeenCalledWith({
      where: { name: 'USER' },
    });
    const [args] = prisma.user.create.mock.calls[0] as [
      {
        data: {
          name: string;
          email: string;
          password: string;
          profileId: string;
        };
      },
    ];
    expect(args.data).toEqual({
      name: user.name,
      email: user.email,
      password: expect.stringMatching(/^scrypt\$/) as unknown,
      profileId: user.profileId,
    });
    await expect(verifyPassword(password, args.data.password)).resolves.toBe(
      true,
    );
  });

  it('autentica hash sem regravar a senha', async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...user,
      password: await hashPassword(password),
    });
    await expect(service.authenticate(user.email, password)).resolves.toEqual(
      publicUser,
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: user.email },
      include: { profile: true },
    });
    expect(prisma.user.findMany).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('migra a senha legada depois da autenticação válida', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    await expect(service.authenticate(user.email, password)).resolves.toEqual(
      publicUser,
    );
    const [args] = prisma.user.update.mock.calls[0] as [
      { where: { id: string; password: string }; data: { password: string } },
    ];
    expect(args.where).toEqual({ id: user.id, password });
    expect(args.data.password).toMatch(/^scrypt\$/);
    await expect(verifyPassword(password, args.data.password)).resolves.toBe(
      true,
    );
  });

  it.each(['ausente', 'legada', 'hash', 'malformado'])(
    'retorna o mesmo 401 genérico para login inválido: %s',
    async (kind) => {
      const stored =
        kind === 'hash'
          ? await hashPassword(password)
          : kind === 'malformado'
            ? 'scrypt$invalido'
            : password;
      prisma.user.findUnique.mockResolvedValue(
        kind === 'ausente' ? null : { ...user, password: stored },
      );
      await expect(service.authenticate(user.email, 'errada')).rejects.toThrow(
        new UnauthorizedException('Email ou senha incorretos!'),
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    },
  );

  it('filtra a lista pelo usuário do token e remove a senha', async () => {
    prisma.user.findMany.mockResolvedValue([user]);
    await expect(service.findAll(user.id)).resolves.toEqual([publicUser]);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { id: user.id },
      include: { profile: true, address: true },
    });
  });

  it('consulta e remove sem devolver a senha', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.user.delete.mockResolvedValue(user);
    await expect(service.findOne(user.id)).resolves.toEqual(publicUser);
    await expect(service.remove(user.id)).resolves.toEqual(publicUser);
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: user.id } });
  });

  it('atualiza a senha com hash sem permitir mudar perfil ou outros campos', async () => {
    prisma.user.update.mockResolvedValue(user);
    const dto = { ...user, profileId: 'admin' };
    await expect(service.update(user.id, dto)).resolves.toEqual(publicUser);
    const [args] = prisma.user.update.mock.calls[0] as [
      { data: { name: string; email: string; password: string } },
    ];
    expect(args.data).toEqual({
      name: user.name,
      email: user.email,
      password: expect.stringMatching(/^scrypt\$/) as unknown,
    });
    await expect(verifyPassword(password, args.data.password)).resolves.toBe(
      true,
    );
  });

  it('preserva a senha quando não há nova senha na edição', async () => {
    prisma.user.update.mockResolvedValue(user);
    await service.update(user.id, { name: 'Novo nome' });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { name: 'Novo nome', email: undefined },
    });
  });

  it.each(['create', 'update'] as const)(
    'traduz conflito de email em 409 no %s, inclusive em concorrência',
    async (method) => {
      prisma.profile.findFirst.mockResolvedValue({ id: user.profileId });
      prisma.user[method].mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Conflito', {
          code: 'P2002',
          clientVersion: '7.5.0',
        }),
      );
      const result =
        method === 'create'
          ? service.create(user)
          : service.update(user.id, { email: user.email });
      await expect(result).rejects.toBeInstanceOf(ConflictException);
    },
  );

  it('retorna 404 para usuário inexistente', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findOne(user.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
