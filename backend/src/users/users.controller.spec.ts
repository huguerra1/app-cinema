import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';
import type { JwtPayload } from '../auth/current-user.decorator';

describe('UsersController (login)', () => {
  let controller: UsersController;
  let jwt: JwtService;
  let prisma: ReturnType<typeof createPrismaMock>;
  const user = {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Cliente',
    email: 'cliente@example.com',
    password: 'senha-de-teste',
    profile: { name: 'USER' },
  };

  beforeEach(async () => {
    prisma = createPrismaMock();
    prisma.user.findMany.mockResolvedValue([user]);
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'segredo-exclusivo-dos-testes',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    controller = module.get(UsersController);
    jwt = module.get(JwtService);
  });

  it('retorna 401 para senha errada', async () => {
    await expect(
      controller.login({ email: user.email, password: 'errada' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('retorna 401 para email não cadastrado', async () => {
    await expect(
      controller.login({
        email: 'ausente@example.com',
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('emite token verificável com sub, papel e expiração, sem senha', async () => {
    const result = await controller.login({
      email: user.email,
      password: user.password,
    });
    const payload = await jwt.verifyAsync<JwtPayload>(result.access_token);
    expect(payload).toEqual(
      expect.objectContaining({
        sub: user.id,
        email: user.email,
        role: 'USER',
      }),
    );
    expect(payload.exp).toEqual(expect.any(Number));
    expect(payload).not.toHaveProperty('password');
    expect(result.user).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      profile: 'USER',
    });
    expect(result.user).not.toHaveProperty('password');
  });
});
