import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('MovieService', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const data = {
    title: 'Matrix',
    durationMinutes: 136,
    synopsis: 'Uma descoberta.',
    genreId: 'genero',
  };
  const record = { id, ...data };
  let service: MovieService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [MovieService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(MovieService);
  });

  it('cria e retorna o registro persistido', async () => {
    prisma.movie.create.mockResolvedValue(record);
    await expect(service.create(data)).resolves.toEqual(record);
    expect(prisma.movie.create).toHaveBeenCalledWith({ data });
  });

  it('lista os registros com as relações', async () => {
    prisma.movie.findMany.mockResolvedValue([record]);
    await expect(service.findAll()).resolves.toEqual([record]);
    expect(prisma.movie.findMany).toHaveBeenCalledWith({
      include: { genre: true },
    });
  });

  it('busca um registro pelo id com as relações', async () => {
    prisma.movie.findUnique.mockResolvedValue(record);
    await expect(service.findOne(id)).resolves.toEqual(record);
    expect(prisma.movie.findUnique).toHaveBeenCalledWith({
      where: { id },
      include: { genre: true },
    });
  });

  it.each(['findOne', 'update', 'remove'] as const)(
    'retorna 404 para id inexistente via %s',
    async (method) => {
      prisma.movie.findUnique.mockResolvedValue(null);
      const result =
        method === 'update' ? service.update(id, {}) : service[method](id);
      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.movie.update).not.toHaveBeenCalled();
      expect(prisma.movie.delete).not.toHaveBeenCalled();
    },
  );

  it('atualiza somente os campos enviados', async () => {
    const changes = { title: 'Novo título' };
    const updated = { ...record, ...changes };
    prisma.movie.findUnique.mockResolvedValue(record);
    prisma.movie.update.mockResolvedValue(updated);
    await expect(service.update(id, changes)).resolves.toEqual(updated);
    expect(prisma.movie.update).toHaveBeenCalledWith({
      where: { id },
      data: changes,
    });
  });

  it('remove o registro existente', async () => {
    prisma.movie.findUnique.mockResolvedValue(record);
    prisma.movie.delete.mockResolvedValue(record);
    await expect(service.remove(id)).resolves.toEqual(record);
    expect(prisma.movie.delete).toHaveBeenCalledWith({ where: { id } });
  });
});
