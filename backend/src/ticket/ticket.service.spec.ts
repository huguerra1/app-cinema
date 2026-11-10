import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('TicketService', () => {
  let service: TicketService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [TicketService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(TicketService);
  });

  it('lista somente ingressos comprados pelo usuário autenticado', async () => {
    await service.findAll('cliente');
    expect(prisma.ticket.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { order: { userId: 'cliente' } },
      }),
    );
  });

  it.each(['findOne', 'remove'] as const)(
    'não acessa ingresso alheio via %s',
    async (method) => {
      prisma.ticket.findFirst.mockResolvedValue(null);
      await expect(service[method]('alheio', 'cliente')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.ticket.findFirst).toHaveBeenCalledWith({
        where: { id: 'alheio', order: { userId: 'cliente' } },
      });
      expect(prisma.ticket.delete).not.toHaveBeenCalled();
    },
  );

  it('não atualiza ingresso alheio', async () => {
    prisma.ticket.findFirst.mockResolvedValue(null);
    await expect(
      service.update('alheio', { seat: 'A1' }, 'cliente'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  it('não vincula um ingresso ao pedido de outra pessoa', async () => {
    prisma.order.findFirst.mockResolvedValue(null);
    await expect(
      service.create(
        {
          sessionId: 'sessão',
          seat: 'A1',
          ...{ price: 10 },
          orderId: 'alheio',
        },
        'cliente',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.order.findFirst).toHaveBeenCalledWith({
      where: { id: 'alheio', userId: 'cliente' },
    });
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  it('mantém a criação de ingressos ainda sem pedido usada pelo mobile', async () => {
    prisma.session.findUnique.mockResolvedValue({
      price: 37.5,
      room: { capacity: 10 },
    });
    prisma.ticket.count.mockResolvedValue(0);
    prisma.ticket.findFirst.mockResolvedValue(null);
    await service.create(
      { sessionId: 'sessão', seat: 'A1', ...{ price: 10 } },
      'cliente',
    );
    expect(prisma.ticket.create).toHaveBeenCalledWith({
      data: {
        sessionId: 'sessão',
        seat: 'A1',
        price: 37.5,
        orderId: undefined,
      },
    });
  });

  it('cria sem preço no corpo e usa o preço da sessão', async () => {
    prisma.session.findUnique.mockResolvedValue({
      price: 25,
      room: { capacity: 10 },
    });
    prisma.ticket.count.mockResolvedValue(0);
    prisma.ticket.findFirst.mockResolvedValue(null);
    await service.create({ sessionId: 'sessão', seat: 'B2' }, 'cliente');
    expect(prisma.ticket.create).toHaveBeenCalledWith({
      data: { sessionId: 'sessão', seat: 'B2', price: 25, orderId: undefined },
    });
  });

  it('converte P2002 do banco em 409 para assento ocupado', async () => {
    prisma.session.findUnique.mockResolvedValue({
      price: 25,
      room: { capacity: 10 },
    });
    prisma.ticket.count.mockResolvedValue(0);
    prisma.ticket.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Restrição única violada', {
        code: 'P2002',
        clientVersion: '7.5.0',
        meta: { target: ['sessionId', 'seat'] },
      }),
    );

    await expect(
      service.create({ sessionId: 'sessão', seat: 'A1' }, 'cliente'),
    ).rejects.toMatchObject({ status: 409, message: 'assento já ocupado' });
    expect(prisma.ticket.findFirst).not.toHaveBeenCalled();
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('retorna 409 sem inserir ingresso quando a sessão está lotada', async () => {
    prisma.session.findUnique.mockResolvedValue({
      price: 25,
      room: { capacity: 1 },
    });
    prisma.ticket.count.mockResolvedValue(1);

    await expect(
      service.create({ sessionId: 'sessão', seat: 'A2' }, 'cliente'),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  it('bloqueia a sessão e usa somente o cliente da transação para contar e criar', async () => {
    const tx = createPrismaMock();
    prisma.$transaction.mockImplementation(
      (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
    );
    const steps: string[] = [];
    tx.$queryRaw.mockImplementation(() => {
      steps.push('bloqueio');
      return Promise.resolve([{ id: 'sessão' }]);
    });
    tx.session.findUnique.mockImplementation(() => {
      steps.push('sessão');
      return Promise.resolve({ price: 25, room: { capacity: 1 } });
    });
    tx.ticket.count.mockImplementation(() => {
      steps.push('contagem');
      return Promise.resolve(0);
    });
    const ticket = { id: 'ingresso', seat: 'A1', price: 25, orderId: null };
    tx.ticket.create.mockImplementation(() => {
      steps.push('criação');
      return Promise.resolve(ticket);
    });

    await expect(
      service.create({ sessionId: 'sessão', seat: 'A1' }, 'cliente'),
    ).resolves.toEqual(ticket);
    expect(steps).toEqual(['bloqueio', 'sessão', 'contagem', 'criação']);
    expect(tx.$queryRaw).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining('SELECT "id" FROM "Session" WHERE "id" = '),
        expect.stringContaining('FOR UPDATE'),
      ]),
      'sessão',
    );
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    });
    expect(prisma.session.findUnique).not.toHaveBeenCalled();
    expect(prisma.ticket.count).not.toHaveBeenCalled();
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  it('retorna 404 sem inserir quando a sessão não existe', async () => {
    prisma.session.findUnique.mockResolvedValue(null);
    await expect(
      service.create({ sessionId: 'ausente', seat: 'A1' }, 'cliente'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  it('propaga falhas do banco que não sejam de unicidade', async () => {
    const error = new Error('Falha na transação');
    prisma.$queryRaw.mockRejectedValue(error);
    await expect(
      service.create({ sessionId: 'sessão', seat: 'A1' }, 'cliente'),
    ).rejects.toBe(error);
  });

  it('ignora preço no PATCH e preserva o preço comprado', async () => {
    prisma.ticket.findFirst.mockResolvedValue({
      id: 'ingresso',
      sessionId: 'sessão',
      price: 37.5,
    });
    const payload = { seat: 'B2', price: 1 };
    await service.update('ingresso', payload, 'cliente');
    expect(prisma.ticket.update).toHaveBeenCalledWith({
      where: { id: 'ingresso', order: { userId: 'cliente' } },
      data: { seat: 'B2' },
    });
  });

  it('não troca a sessão de um ingresso comprado', async () => {
    prisma.ticket.findFirst.mockResolvedValue({
      id: 'ingresso',
      sessionId: 'sessão',
    });
    await expect(
      service.update('ingresso', { sessionId: 'outra' }, 'cliente'),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  it('não transfere um ingresso para outro pedido', async () => {
    prisma.ticket.findFirst.mockResolvedValue({
      id: 'ingresso',
      orderId: 'original',
    });
    await expect(
      service.update('ingresso', { orderId: 'outro' }, 'cliente'),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });
});
