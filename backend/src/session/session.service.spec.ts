import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('SessionService', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const data = {
    movieId: '22222222-2222-4222-8222-222222222222',
    roomId: '33333333-3333-4333-8333-333333333333',
    startTime: '2026-11-11T20:00:00.000Z',
    price: 35,
  };
  const record = { id, ...data, startTime: new Date(data.startTime) };
  let service: SessionService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [SessionService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(SessionService);
    prisma.movie.findUnique.mockResolvedValue({ durationMinutes: 120 });
    prisma.session.findMany.mockResolvedValue([]);
  });

  it('cria com data convertida e preço informado', async () => {
    prisma.session.create.mockResolvedValue(record);
    await expect(service.create(data)).resolves.toEqual(record);
    expect(prisma.movie.findUnique).toHaveBeenCalledWith({
      where: { id: data.movieId },
    });
    expect(prisma.session.findMany).toHaveBeenCalledWith({
      where: { roomId: data.roomId },
      include: { movie: true },
    });
    expect(prisma.session.create).toHaveBeenCalledWith({
      data: { ...data, startTime: new Date(data.startTime) },
    });
  });

  it('preserva o preço padrão do banco quando omitido', async () => {
    await service.create({
      movieId: data.movieId,
      roomId: data.roomId,
      startTime: data.startTime,
    });
    expect(prisma.session.create).toHaveBeenCalledWith({
      data: { ...data, startTime: new Date(data.startTime), price: undefined },
    });
  });

  it('retorna 404 ao tentar criar com filme inexistente', async () => {
    prisma.movie.findUnique.mockResolvedValue(null);
    await expect(service.create(data)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.session.create).not.toHaveBeenCalled();
  });

  it.each(['19:00', '20:00', '21:00'])(
    'rejeita conflito com sessão existente às %s',
    async (time) => {
      prisma.session.findMany.mockResolvedValue([
        {
          startTime: new Date(`2026-11-11T${time}:00.000Z`),
          movie: { durationMinutes: 120 },
        },
      ]);
      await expect(service.create(data)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.session.create).not.toHaveBeenCalled();
    },
  );

  it.each(['18:00', '22:00'])(
    'permite horários adjacentes à sessão das %s',
    async (time) => {
      prisma.session.findMany.mockResolvedValue([
        {
          startTime: new Date(`2026-11-11T${time}:00.000Z`),
          movie: { durationMinutes: 120 },
        },
      ]);
      prisma.session.create.mockResolvedValue(record);
      await expect(service.create(data)).resolves.toEqual(record);
    },
  );

  it('lista com filme e sala', async () => {
    prisma.session.findMany.mockResolvedValue([record]);
    await expect(service.findAll()).resolves.toEqual([record]);
    expect(prisma.session.findMany).toHaveBeenCalledWith({
      include: { movie: true, room: true },
    });
  });

  it('busca pelo id com filme e sala', async () => {
    prisma.session.findUnique.mockResolvedValue(record);
    await expect(service.findOne(id)).resolves.toEqual(record);
    expect(prisma.session.findUnique).toHaveBeenCalledWith({
      where: { id },
      include: { movie: true, room: true },
    });
  });

  it.each(['findOne', 'update', 'remove'] as const)(
    'retorna 404 para id inexistente via %s',
    async (method) => {
      prisma.session.findUnique.mockResolvedValue(null);
      const result =
        method === 'update' ? service.update(id, {}) : service[method](id);
      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.session.update).not.toHaveBeenCalled();
      expect(prisma.session.delete).not.toHaveBeenCalled();
    },
  );

  it('atualiza o preço sem sobrescrever campos omitidos', async () => {
    prisma.session.findUnique.mockResolvedValue(record);
    prisma.session.update.mockResolvedValue({ ...record, price: 40 });
    await expect(service.update(id, { price: 40 })).resolves.toEqual({
      ...record,
      price: 40,
    });
    expect(prisma.session.update).toHaveBeenCalledWith({
      where: { id },
      data: { price: 40 },
    });
  });

  it('remove uma sessão existente', async () => {
    prisma.session.findUnique.mockResolvedValue(record);
    prisma.session.delete.mockResolvedValue(record);
    await expect(service.remove(id)).resolves.toEqual(record);
    expect(prisma.session.delete).toHaveBeenCalledWith({ where: { id } });
  });
});
