import { ForbiddenException, NotFoundException } from '@nestjs/common';
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
        { sessionId: 'sessão', seat: 'A1', price: 10, orderId: 'alheio' },
        'cliente',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.order.findFirst).toHaveBeenCalledWith({
      where: { id: 'alheio', userId: 'cliente' },
    });
    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  it('mantém a criação de ingressos ainda sem pedido usada pelo mobile', async () => {
    prisma.session.findUnique.mockResolvedValue({ room: { capacity: 10 } });
    prisma.ticket.count.mockResolvedValue(0);
    prisma.ticket.findFirst.mockResolvedValue(null);
    await service.create(
      { sessionId: 'sessão', seat: 'A1', price: 10 },
      'cliente',
    );
    expect(prisma.ticket.create).toHaveBeenCalledWith({
      data: { sessionId: 'sessão', seat: 'A1', price: 10, orderId: undefined },
    });
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
