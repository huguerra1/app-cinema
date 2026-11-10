import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Server } from 'node:http';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createPrismaMock } from '../src/prisma/prisma.mock';

describe('App (HTTP, sem banco)', () => {
  let app: INestApplication<Server>;
  const prisma = createPrismaMock();
  const originalSecret = process.env.JWT_SECRET;
  const userId = '11111111-1111-4111-8111-111111111111';
  const resourceId = '22222222-2222-4222-8222-222222222222';

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
