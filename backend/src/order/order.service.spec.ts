import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('OrderService', () => {
  const userId = '11111111-1111-4111-8111-111111111111';
  const otherId = '22222222-2222-4222-8222-222222222222';
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: OrderService;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [OrderService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(OrderService);
  });

  it('consulta apenas pedidos do usuário informado pelo token', async () => {
    const orders = [{ id: 'pedido', userId }];
    prisma.order.findMany.mockResolvedValue(orders);
    await expect(service.findAllByUserId(userId)).resolves.toEqual(orders);
    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId } }),
    );
  });

  it('usa o usuário autenticado e calcula o total no servidor', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: userId });
    prisma.ticket.findMany.mockResolvedValue([
      { id: 'ingresso', price: 15, orderId: null },
    ]);
    prisma.snackCombo.findMany.mockResolvedValue([{ id: 'combo', price: 10 }]);
    prisma.order.create.mockResolvedValue({ id: 'pedido', userId, total: 35 });
    prisma.ticket.updateMany.mockResolvedValue({ count: 1 });
    const order = {
      id: 'pedido',
      userId,
      total: 35,
      tickets: [{ id: 'ingresso', price: 15, orderId: 'pedido' }],
      snackCombos: [{ quantity: 2, snackCombo: { id: 'combo', price: 10 } }],
    };
    prisma.order.findUniqueOrThrow.mockResolvedValue(order);
    await expect(
      service.create(
        {
          ticketIds: ['ingresso'],
          snackCombos: [{ snackComboId: 'combo', quantity: 2 }],
        },
        userId,
      ),
    ).resolves.toEqual(order);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId, total: 35 }) as unknown,
      }),
    );
    expect(prisma.ticket.updateMany).toHaveBeenCalledWith({
      where: { id: 'ingresso', orderId: null },
      data: { orderId: 'pedido' },
    });
    expect(prisma.order.create.mock.calls[0]).toEqual([
      {
        data: {
          userId,
          total: 35,
          snackCombos: {
            create: [{ quantity: 2, snackCombo: { connect: { id: 'combo' } } }],
          },
        },
        include: {
          tickets: true,
          snackCombos: { include: { snackCombo: true } },
        },
      },
    ]);
    expect(prisma.order.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 'pedido' },
      include: {
        tickets: true,
        snackCombos: { include: { snackCombo: true } },
      },
    });
  });

  it.each([userId, otherId])(
    'ignora o userId legado %s e usa o token',
    async (bodyUserId) => {
      prisma.user.findUnique.mockResolvedValue({ id: userId });
      await service.create({ ...{ userId: bodyUserId } }, userId);
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId }) as unknown,
        }),
      );
    },
  );

  it('não permite reutilizar um ingresso comprado', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: userId });
    prisma.ticket.findMany.mockResolvedValue([
      { id: 'ingresso', price: 15, orderId: 'outro-pedido' },
    ]);
    await expect(
      service.create({ ticketIds: ['ingresso'] }, userId),
    ).rejects.toMatchObject({ status: 409 });
    expect(prisma.order.create).not.toHaveBeenCalled();
    expect(prisma.ticket.updateMany).not.toHaveBeenCalled();
  });

  it('aborta toda a transação se um ingresso for usado após a leitura', async () => {
    const tx = createPrismaMock();
    const persisted = {
      orders: [] as string[],
      combos: [] as string[],
      ticketOrders: { primeiro: null, segundo: 'outro-pedido' } as Record<
        string,
        string | null
      >,
    };
    const pending = {
      orders: [...persisted.orders],
      combos: [...persisted.combos],
      ticketOrders: { ...persisted.ticketOrders },
    };
    // Este mock só confirma as escritas se o callback terminar sem exceção.
    prisma.$transaction.mockImplementation(
      async (callback: (client: typeof tx) => Promise<unknown>) => {
        const result = await callback(tx);
        Object.assign(persisted, pending);
        return result;
      },
    );
    tx.user.findUnique.mockResolvedValue({ id: userId });
    tx.ticket.findMany.mockResolvedValue([
      { id: 'primeiro', price: 15, orderId: null },
      { id: 'segundo', price: 20, orderId: null },
    ]);
    tx.snackCombo.findMany.mockResolvedValue([{ id: 'combo', price: 10 }]);
    tx.order.create.mockImplementation(() => {
      pending.orders.push('pedido');
      pending.combos.push('combo');
      return Promise.resolve({ id: 'pedido', userId, total: 45 });
    });
    tx.ticket.updateMany.mockImplementation(
      ({
        where,
        data,
      }: {
        where: { id: string };
        data: { orderId: string };
      }) => {
        if (pending.ticketOrders[where.id] !== null) {
          return Promise.resolve({ count: 0 });
        }
        pending.ticketOrders[where.id] = data.orderId;
        return Promise.resolve({ count: 1 });
      },
    );

    await expect(
      service.create(
        {
          ticketIds: ['segundo', 'primeiro'],
          snackCombos: [{ snackComboId: 'combo', quantity: 1 }],
        },
        userId,
      ),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(tx.ticket.updateMany).toHaveBeenNthCalledWith(1, {
      where: { id: 'primeiro', orderId: null },
      data: { orderId: 'pedido' },
    });
    expect(tx.ticket.updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: 'segundo', orderId: null },
      data: { orderId: 'pedido' },
    });
    expect(pending.ticketOrders.primeiro).toBe('pedido');
    expect(persisted).toEqual({
      orders: [],
      combos: [],
      ticketOrders: { primeiro: null, segundo: 'outro-pedido' },
    });
    expect(tx.order.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.ticket.findMany).not.toHaveBeenCalled();
    expect(prisma.snackCombo.findMany).not.toHaveBeenCalled();
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it('filtra a busca por ID e não expõe dados do usuário', async () => {
    prisma.order.findFirst.mockResolvedValue({ id: 'pedido', userId });
    await service.findOne('pedido', userId);
    expect(prisma.order.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pedido', userId },
      }),
    );
    expect(prisma.order.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.not.objectContaining({ user: true }) as unknown,
      }),
    );
  });

  it.each(['findOne', 'remove'] as const)(
    'não acessa pedido alheio via %s',
    async (method) => {
      prisma.order.findFirst.mockResolvedValue(null);
      await expect(service[method]('alheio', userId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.order.delete).not.toHaveBeenCalled();
      expect(prisma.snackCombosOnOrders.deleteMany).not.toHaveBeenCalled();
    },
  );

  it('não altera um pedido alheio', async () => {
    prisma.order.findFirst.mockResolvedValue(null);
    await expect(service.update('alheio', {}, userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.order.update).not.toHaveBeenCalled();
  });

  it('não transfere a propriedade de um pedido', async () => {
    prisma.order.findFirst.mockResolvedValue({ id: 'pedido', userId });
    await service.update('pedido', { ...{ userId: otherId } }, userId);
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'pedido', userId },
      data: { userId },
    });
  });

  it('não aplica alterações de itens sem recalcular o total', async () => {
    prisma.order.findFirst.mockResolvedValue({ id: 'pedido', userId });
    await expect(
      service.update('pedido', { ticketIds: [] }, userId),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.order.update).not.toHaveBeenCalled();
  });

  it('remove apenas um pedido próprio e suas relações na mesma transação', async () => {
    prisma.order.findFirst.mockResolvedValue({ id: 'pedido', userId });
    await service.remove('pedido', userId);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.snackCombosOnOrders.deleteMany).toHaveBeenCalledWith({
      where: { orderId: 'pedido' },
    });
    expect(prisma.order.delete).toHaveBeenCalledWith({
      where: { id: 'pedido', userId },
    });
  });
});
