import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { RoomService } from './room.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('RoomService', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const data = { name: 'Sala 1', capacity: 100 };
  const record = { id, ...data };
  let service: RoomService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [RoomService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(RoomService);
  });

  it('cria e retorna o registro persistido', async () => {
    prisma.room.create.mockResolvedValue(record);
    await expect(service.create(data)).resolves.toEqual(record);
    expect(prisma.room.create).toHaveBeenCalledWith({ data });
  });

  it('lista os registros', async () => {
    prisma.room.findMany.mockResolvedValue([record]);
    await expect(service.findAll()).resolves.toEqual([record]);
    expect(prisma.room.findMany).toHaveBeenCalledWith();
  });

  it('busca um registro pelo id', async () => {
    prisma.room.findUnique.mockResolvedValue(record);
    await expect(service.findOne(id)).resolves.toEqual(record);
    expect(prisma.room.findUnique).toHaveBeenCalledWith({ where: { id } });
  });

  it.each(['findOne', 'update', 'remove'] as const)(
    'retorna 404 para id inexistente via %s',
    async (method) => {
      prisma.room.findUnique.mockResolvedValue(null);
      const result =
        method === 'update' ? service.update(id, {}) : service[method](id);
      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.room.update).not.toHaveBeenCalled();
      expect(prisma.room.delete).not.toHaveBeenCalled();
    },
  );

  it('atualiza somente os campos enviados', async () => {
    const changes = { capacity: 120 };
    const updated = { ...record, ...changes };
    prisma.room.findUnique.mockResolvedValue(record);
    prisma.room.update.mockResolvedValue(updated);
    await expect(service.update(id, changes)).resolves.toEqual(updated);
    expect(prisma.room.update).toHaveBeenCalledWith({
      where: { id },
      data: changes,
    });
  });

  it('remove o registro existente', async () => {
    prisma.room.findUnique.mockResolvedValue(record);
    prisma.room.delete.mockResolvedValue(record);
    await expect(service.remove(id)).resolves.toEqual(record);
    expect(prisma.room.delete).toHaveBeenCalledWith({ where: { id } });
  });
});
