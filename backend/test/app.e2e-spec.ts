import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Server } from 'node:http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createPrismaMock } from '../src/prisma/prisma.mock';
import { JwtService } from '@nestjs/jwt';

describe('App (HTTP, sem banco)', () => {
  let app: INestApplication<Server>;
  const prisma = createPrismaMock();
  const originalSecret = process.env.JWT_SECRET;
  const userId = '11111111-1111-4111-8111-111111111111';
  const resourceId = '22222222-2222-4222-8222-222222222222';
  const jwt = new JwtService({ secret: 'segredo-exclusivo-dos-testes' });

  beforeAll(async () => {
    process.env.JWT_SECRET = 'segredo-exclusivo-dos-testes';
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app?.close();
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  it('GET /api', async () => {
    await request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
    expect(prisma.$connect).not.toHaveBeenCalled();
  });

  describe.each(['order', 'ticket', 'address', 'profile'])(
    '%s exige autenticação',
    (route) => {
      it.each([
        ['get', ''],
        ['post', ''],
        ['get', '/' + resourceId],
        ['patch', '/' + resourceId],
        ['delete', '/' + resourceId],
      ] as const)('%s %s retorna 401', async (method, suffix) => {
        await request(app.getHttpServer())
          [method]('/api/' + route + suffix)
          .send({})
          .expect(401);
      });
    },
  );

  it.each([
    ['get', '/api/users'],
    ['get', '/api/users/me'],
    ['get', '/api/users/' + userId],
    ['patch', '/api/users/' + userId],
    ['delete', '/api/users/' + userId],
  ] as const)('%s %s exige autenticação', async (method, path) => {
    await request(app.getHttpServer())[method](path).send({}).expect(401);
  });

  it.each([
    ['movie', 'movie'],
    ['genre', 'genre'],
    ['room', 'room'],
    ['session', 'session'],
    ['snack-combo', 'snackCombo'],
  ] as const)('mantém o catálogo %s público', async (route, delegate) => {
    prisma[delegate].findMany.mockResolvedValue([]);
    await request(app.getHttpServer())
      .get('/api/' + route)
      .expect(200)
      .expect([]);
  });

  describe.each(['movie', 'genre', 'room', 'session', 'snack-combo'])(
    'escritas do catálogo %s',
    (route) => {
      it.each([
        ['post', ''],
        ['patch', '/' + resourceId],
        ['delete', '/' + resourceId],
      ] as const)(
        '%s %s exige JWT e ADMIN antes de validar o corpo',
        async (method, suffix) => {
          await request(app.getHttpServer())
            [method]('/api/' + route + suffix)
            .send({})
            .expect(401);
          const token = await jwt.signAsync({ sub: userId, role: 'USER' });
          await request(app.getHttpServer())
            [method]('/api/' + route + suffix)
            .set('Authorization', 'Bearer ' + token)
            .send({})
            .expect(403);
        },
      );
    },
  );

  it.each(['ADMIN', undefined])(
    'permite criar gênero com admin e papel %s no JWT',
    async (role) => {
      prisma.user.findUnique.mockResolvedValue({ profile: { name: 'ADMIN' } });
      prisma.genre.create.mockResolvedValue({ id: resourceId, name: 'Drama' });
      const token = await jwt.signAsync({
        sub: userId,
        ...(role ? { role } : {}),
      });
      await request(app.getHttpServer())
        .post('/api/genre')
        .set('Authorization', 'Bearer ' + token)
        .send({ name: 'Drama' })
        .expect(201)
        .expect({ id: resourceId, name: 'Drama' });
      expect(prisma.genre.create).toHaveBeenCalledWith({
        data: { name: 'Drama' },
      });
      if (!role)
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: { id: userId },
          select: { profile: { select: { name: true } } },
        });
    },
  );

  it('rejeita token antigo cujo usuário não é admin no banco', async () => {
    prisma.user.findUnique.mockResolvedValue({ profile: { name: 'USER' } });
    const token = await jwt.signAsync({ sub: userId });
    await request(app.getHttpServer())
      .post('/api/genre')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Drama' })
      .expect(403);
    expect(prisma.genre.create).not.toHaveBeenCalled();
  });

  it('mantém GET por id público', async () => {
    prisma.genre.findUnique.mockResolvedValue({
      id: resourceId,
      name: 'Drama',
    });
    await request(app.getHttpServer())
      .get('/api/genre/' + resourceId)
      .expect(200)
      .expect({ id: resourceId, name: 'Drama' });
  });

  it.each([{}, { price: 1 }, { price: -10 }, { price: 'ignorado' }])(
    'POST /ticket usa preço da sessão com corpo %j',
    async (price) => {
      const token = await jwt.signAsync({ sub: userId, role: 'USER' });
      prisma.session.findUnique.mockResolvedValue({
        price: 42,
        room: { capacity: 100 },
      });
      prisma.ticket.count.mockResolvedValue(0);
      prisma.ticket.findFirst.mockResolvedValue(null);
      prisma.ticket.create.mockResolvedValue({
        id: resourceId,
        price: 42,
        seat: 'A1',
      });
      await request(app.getHttpServer())
        .post('/api/ticket')
        .set('Authorization', 'Bearer ' + token)
        .send({ sessionId: resourceId, seat: 'A1', ...price })
        .expect(201)
        .expect({ id: resourceId, price: 42, seat: 'A1' });
      expect(prisma.ticket.create).toHaveBeenCalledWith({
        data: {
          sessionId: resourceId,
          seat: 'A1',
          price: 42,
          orderId: undefined,
        },
      });
    },
  );

  it('admin define preço na criação e edição de sessão', async () => {
    const token = await jwt.signAsync({ sub: userId, role: 'ADMIN' });
    prisma.movie.findUnique.mockResolvedValue({ durationMinutes: 120 });
    prisma.session.findMany.mockResolvedValue([]);
    prisma.session.create.mockResolvedValue({ id: resourceId, price: 35 });
    await request(app.getHttpServer())
      .post('/api/session')
      .set('Authorization', 'Bearer ' + token)
      .send({
        movieId: resourceId,
        roomId: resourceId,
        startTime: '2026-11-11T20:00:00.000Z',
        price: 35,
      })
      .expect(201);
    expect(prisma.session.create).toHaveBeenCalledWith({
      data: {
        movieId: resourceId,
        roomId: resourceId,
        startTime: new Date('2026-11-11T20:00:00.000Z'),
        price: 35,
      },
    });
    await request(app.getHttpServer())
      .patch('/api/session/' + resourceId)
      .set('Authorization', 'Bearer ' + token)
      .send({ price: 40 })
      .expect(200);
    expect(prisma.session.update).toHaveBeenCalledWith({
      where: { id: resourceId },
      data: { price: 40 },
    });
    await request(app.getHttpServer())
      .patch('/api/session/' + resourceId)
      .set('Authorization', 'Bearer ' + token)
      .send({ price: -1 })
      .expect(400);
  });

  it('retorna 401 para login com senha errada', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: userId,
      email: 'cliente@example.com',
      password: 'correta',
      name: 'Cliente',
      profile: { name: 'USER' },
    });
    await request(app.getHttpServer())
      .post('/api/users/login')
      .send({ email: 'cliente@example.com', password: 'errada' })
      .expect(401);
  });

  it('aceita em /order/me o token emitido pelo login com o segredo compartilhado', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: userId,
      email: 'cliente@example.com',
      password: 'correta',
      name: 'Cliente',
      profile: { name: 'USER' },
    });
    const response = await request(app.getHttpServer())
      .post('/api/users/login')
      .send({ email: 'cliente@example.com', password: 'correta' })
      .expect(201);
    const body = response.body as { access_token: string };
    expect(response.body).not.toHaveProperty('user.password');
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { password: expect.stringMatching(/^scrypt\$/) as unknown },
      }),
    );
    await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', 'Bearer ' + body.access_token)
      .expect(200)
      .expect({
        id: userId,
        email: 'cliente@example.com',
        name: 'Cliente',
        profile: { name: 'USER' },
      });
    prisma.order.findMany.mockResolvedValue([{ id: resourceId, userId }]);
    await request(app.getHttpServer())
      .get('/api/order/me')
      .set('Authorization', 'Bearer ' + body.access_token)
      .expect(200)
      .expect([{ id: resourceId, userId }]);
    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId } }),
    );
  });
});
