import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('OrderController (HTTP, sem banco)', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const otherId = '22222222-2222-4222-8222-222222222222';
  let app: INestApplication<Server>;
  let prisma: ReturnType<typeof createPrismaMock>;
  let authorization: string;

  beforeAll(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'segredo-exclusivo-dos-testes' })],
      controllers: [OrderController],
      providers: [
        OrderService,
        JwtAuthGuard,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    authorization =
      'Bearer ' + (await module.get(JwtService).signAsync({ sub: userId }));
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.order.findMany.mockResolvedValue([{ id: 'pedido', userId }]);
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    ['get', '/api/order'],
    ['get', '/api/order/me'],
    ['get', '/api/order/user/' + userId],
    ['get', '/api/order/' + otherId],
    ['post', '/api/order'],
    ['patch', '/api/order/' + otherId],
    ['delete', '/api/order/' + otherId],
  ] as const)('exige token para %s %s', async (method, path) => {
    await request(app.getHttpServer())[method](path).expect(401);
    expect(prisma.order.findMany).not.toHaveBeenCalled();
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it.each(['/api/order', '/api/order/me', '/api/order/user/' + userId])(
    'filtra pelo token em GET %s',
    async (path) => {
      const response = await request(app.getHttpServer())
        .get(path)
        .set('Authorization', authorization)
        .expect(200);
      expect(response.body).toEqual([{ id: 'pedido', userId }]);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId } }),
      );
      expect(prisma.order.findFirst).not.toHaveBeenCalled();
    },
  );

  it('retorna 403 para o userId de outra pessoa', async () => {
    await request(app.getHttpServer())
      .get('/api/order/user/' + otherId)
      .set('Authorization', authorization)
      .expect(403);
    expect(prisma.order.findMany).not.toHaveBeenCalled();
  });

  it('retorna 401 para token inválido', async () => {
    await request(app.getHttpServer())
      .get('/api/order/me')
      .set('Authorization', 'Bearer invalido')
      .expect(401);
    expect(prisma.order.findMany).not.toHaveBeenCalled();
  });

  it('cria pedido sem userId no corpo', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: userId });
    prisma.order.create.mockResolvedValue({ id: 'pedido', userId, total: 0 });
    await request(app.getHttpServer())
      .post('/api/order')
      .set('Authorization', authorization)
      .send({})
      .expect(201)
      .expect({ id: 'pedido', userId, total: 0 });
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId }) as unknown,
      }),
    );
  });

  it('ignora userId alheio no corpo e usa o token', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: userId });
    prisma.order.create.mockResolvedValue({ id: 'pedido', userId, total: 0 });
    await request(app.getHttpServer())
      .post('/api/order')
      .set('Authorization', authorization)
      .send({ userId: otherId })
      .expect(201)
      .expect({ id: 'pedido', userId, total: 0 });
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId }) as unknown,
      }),
    );
  });

  it.each(['get', 'patch', 'delete'] as const)(
    'não acessa pedido alheio via %s',
    async (method) => {
      prisma.order.findFirst.mockResolvedValue(null);
      await request(app.getHttpServer())
        [method]('/api/order/' + otherId)
        .set('Authorization', authorization)
        .send({})
        .expect(404);
      expect(prisma.order.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: otherId, userId },
        }),
      );
      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(prisma.order.delete).not.toHaveBeenCalled();
    },
  );
});
