import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SnackComboService } from './snack-combo.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('SnackComboService', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const data = { name: 'Pipoca e refri', price: 19.9 };
  const record = { id, ...data };
  let service: SnackComboService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [
        SnackComboService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(SnackComboService);
  });

  it('cria e retorna o registro persistido', async () => {
    prisma.snackCombo.create.mockResolvedValue(record);
    await expect(service.create(data)).resolves.toEqual(record);
    expect(prisma.snackCombo.create).toHaveBeenCalledWith({ data });
  });

  it('lista os registros', async () => {
    prisma.snackCombo.findMany.mockResolvedValue([record]);
    await expect(service.findAll()).resolves.toEqual([record]);
    expect(prisma.snackCombo.findMany).toHaveBeenCalledWith();
  });

  it('busca um registro pelo id', async () => {
    prisma.snackCombo.findUnique.mockResolvedValue(record);
    await expect(service.findOne(id)).resolves.toEqual(record);
    expect(prisma.snackCombo.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it.each(['findOne', 'update', 'remove'] as const)(
    'retorna 404 para id inexistente via %s',
    async (method) => {
      prisma.snackCombo.findUnique.mockResolvedValue(null);
      const result =
        method === 'update' ? service.update(id, {}) : service[method](id);
      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.snackCombo.update).not.toHaveBeenCalled();
      expect(prisma.snackCombo.delete).not.toHaveBeenCalled();
    },
  );

  it('atualiza somente os campos enviados', async () => {
    const changes = { price: 22.5 };
    const updated = { ...record, ...changes };
    prisma.snackCombo.findUnique.mockResolvedValue(record);
    prisma.snackCombo.update.mockResolvedValue(updated);
    await expect(service.update(id, changes)).resolves.toEqual(updated);
    expect(prisma.snackCombo.update).toHaveBeenCalledWith({
      where: { id },
      data: changes,
    });
  });

  it('remove o registro existente', async () => {
    prisma.snackCombo.findUnique.mockResolvedValue(record);
    prisma.snackCombo.delete.mockResolvedValue(record);
    await expect(service.remove(id)).resolves.toEqual(record);
    expect(prisma.snackCombo.delete).toHaveBeenCalledWith({ where: { id } });
  });
});
