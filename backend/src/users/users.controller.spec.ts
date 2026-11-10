import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { hashPassword, verifyPassword } from '../auth/password';
import type { JwtPayload } from '../auth/current-user.decorator';

describe('UsersController (HTTP, sem banco)', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const otherId = '22222222-2222-4222-8222-222222222222';
  const user = {
    id: userId,
    name: 'Cliente',
    email: 'cliente@example.com',
    password: 'senha-de-teste',
    profileId: 'perfil-cliente',
    profile: { name: 'USER' },
  };
  const { password, ...publicUser } = user;
  let app: INestApplication<Server>;
  let prisma: ReturnType<typeof createPrismaMock>;
  let jwt: JwtService;
  let authorization: string;

  beforeAll(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'segredo-exclusivo-dos-testes',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        JwtAuthGuard,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    jwt = module.get(JwtService);
    authorization = 'Bearer ' + (await jwt.signAsync({ sub: userId }));
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    prisma.user.findUnique.mockResolvedValue(user);
    prisma.user.findMany.mockResolvedValue([user]);
    prisma.user.create.mockResolvedValue(user);
    prisma.user.update.mockResolvedValue(user);
    prisma.user.delete.mockResolvedValue(user);
    prisma.profile.findFirst.mockResolvedValue({ id: user.profileId });
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    ['get', '/api/users'],
    ['get', '/api/users/me'],
    ['get', '/api/users/' + userId],
    ['patch', '/api/users/' + userId],
    ['delete', '/api/users/' + userId],
  ] as const)('exige token para %s %s', async (method, path) => {
    await request(app.getHttpServer())[method](path).send({}).expect(401);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.findMany).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it('recusa token inválido em /users/me', async () => {
    await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalido')
      .expect(401);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it.each(['get', 'patch', 'delete'] as const)(
    'retorna 403 para outro id via %s',
    async (method) => {
      await request(app.getHttpServer())
        [method]('/api/users/' + otherId)
        .set('Authorization', authorization)
        .send({})
        .expect(403);
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.user.delete).not.toHaveBeenCalled();
    },
  );

  it('cadastra publicamente com hash e perfil USER, ignorando o profileId do corpo', async () => {
    await request(app.getHttpServer())
      .post('/api/users')
      .send({ ...user, profileId: otherId })
      .expect(201)
      .expect(publicUser);
    const [args] = prisma.user.create.mock.calls[0] as [
      { data: { password: string; profileId: string } },
    ];
    expect(args.data.profileId).toBe(user.profileId);
    expect(args.data.password).toMatch(/^scrypt\$/);
    await expect(verifyPassword(password, args.data.password)).resolves.toBe(
      true,
    );
  });

  it.each(['hash', 'legada'] as const)(
    'faz login público com senha %s, sem expor senha no JWT ou resposta',
    async (kind) => {
      prisma.user.findUnique.mockResolvedValue({
        ...user,
        password: kind === 'hash' ? await hashPassword(password) : password,
      });
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ email: user.email, password })
        .expect(201);
      const body = response.body as { access_token: string; user: unknown };
      expect(body.user).toEqual({
        id: userId,
        name: user.name,
        email: user.email,
        profile: 'USER',
      });
      expect(body).not.toHaveProperty('password');
      const payload = await jwt.verifyAsync<JwtPayload>(body.access_token);
      expect(payload).toEqual({
        sub: userId,
        email: user.email,
        role: 'USER',
        iat: expect.any(Number) as unknown,
        exp: expect.any(Number) as unknown,
      });
      expect(prisma.user.update).toHaveBeenCalledTimes(kind === 'hash' ? 0 : 1);
    },
  );

  it.each(['email ausente', 'senha legada errada', 'hash errado'])(
    'retorna 401 com mensagem genérica para %s',
    async (kind) => {
      prisma.user.findUnique.mockResolvedValue(
        kind === 'email ausente'
          ? null
          : {
              ...user,
              password:
                kind === 'hash errado'
                  ? await hashPassword(password)
                  : password,
            },
      );
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ email: user.email, password: 'errada' })
        .expect(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Email ou senha incorretos!',
        error: 'Unauthorized',
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    },
  );

  it('retorna somente o próprio usuário em lista, sem senha', async () => {
    await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', authorization)
      .expect(200)
      .expect([publicUser]);
    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: userId } }),
    );
  });

  it.each(['/api/users/me', '/api/users/' + userId])(
    'consulta o próprio usuário em %s sem senha',
    async (path) => {
      await request(app.getHttpServer())
        .get(path)
        .set('Authorization', authorization)
        .expect(200)
        .expect(publicUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: userId } }),
      );
    },
  );

  it('edita o próprio usuário com hash, ignorando profileId e sem devolver senha', async () => {
    await request(app.getHttpServer())
      .patch('/api/users/' + userId)
      .set('Authorization', authorization)
      .send({ name: 'Novo nome', password: 'nova-senha', profileId: otherId })
      .expect(200)
      .expect(publicUser);
    const [args] = prisma.user.update.mock.calls[0] as [
      { data: { password: string } },
    ];
    expect(args.data).not.toHaveProperty('profileId');
    expect(args.data.password).toMatch(/^scrypt\$/);
    await expect(
      verifyPassword('nova-senha', args.data.password),
    ).resolves.toBe(true);
  });

  it('retorna 409 ao tentar usar email já cadastrado na edição', async () => {
    prisma.user.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Conflito', {
        code: 'P2002',
        clientVersion: '7.5.0',
      }),
    );
    await request(app.getHttpServer())
      .patch('/api/users/' + userId)
      .set('Authorization', authorization)
      .send({ email: 'ocupado@example.com' })
      .expect(409);
  });

  it.each([{ password: null }, { password: 'curta' }, { email: null }])(
    'rejeita campos inválidos na edição: %j',
    async (body) => {
      await request(app.getHttpServer())
        .patch('/api/users/' + userId)
        .set('Authorization', authorization)
        .send(body)
        .expect(400);
      expect(prisma.user.update).not.toHaveBeenCalled();
    },
  );

  it('exclui o próprio usuário sem devolver senha', async () => {
    await request(app.getHttpServer())
      .delete('/api/users/' + userId)
      .set('Authorization', authorization)
      .expect(200)
      .expect(publicUser);
  });

  it('valida o corpo do login antes de consultar o Prisma', async () => {
    await request(app.getHttpServer())
      .post('/api/users/login')
      .send({})
      .expect(400);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
