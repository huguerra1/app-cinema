import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('GenreService', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const data = { name: 'Drama' };
  const record = { id, ...data };
  let service: GenreService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [GenreService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(GenreService);
  });

  it('cria e retorna o registro persistido', async () => {
    prisma.genre.create.mockResolvedValue(record);
    await expect(service.create(data)).resolves.toEqual(record);
    expect(prisma.genre.create).toHaveBeenCalledWith({ data });
  });

  it('lista os registros', async () => {
    prisma.genre.findMany.mockResolvedValue([record]);
    await expect(service.findAll()).resolves.toEqual([record]);
    expect(prisma.genre.findMany).toHaveBeenCalledWith();
  });

  it('busca um registro pelo id', async () => {
    prisma.genre.findUnique.mockResolvedValue(record);
    await expect(service.findOne(id)).resolves.toEqual(record);
    expect(prisma.genre.findUnique).toHaveBeenCalledWith({ where: { id } });
  });

  it.each(['findOne', 'update', 'remove'] as const)(
    'retorna 404 para id inexistente via %s',
    async (method) => {
      prisma.genre.findUnique.mockResolvedValue(null);
      const result =
        method === 'update' ? service.update(id, {}) : service[method](id);
      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.genre.update).not.toHaveBeenCalled();
      expect(prisma.genre.delete).not.toHaveBeenCalled();
    },
  );

  it('atualiza somente os campos enviados', async () => {
    const changes = { name: 'Comédia' };
    const updated = { ...record, ...changes };
    prisma.genre.findUnique.mockResolvedValue(record);
    prisma.genre.update.mockResolvedValue(updated);
    await expect(service.update(id, changes)).resolves.toEqual(updated);
    expect(prisma.genre.update).toHaveBeenCalledWith({
      where: { id },
      data: changes,
    });
  });

  it('remove o registro existente', async () => {
    prisma.genre.findUnique.mockResolvedValue(record);
    prisma.genre.delete.mockResolvedValue(record);
    await expect(service.remove(id)).resolves.toEqual(record);
    expect(prisma.genre.delete).toHaveBeenCalledWith({ where: { id } });
  });
});
