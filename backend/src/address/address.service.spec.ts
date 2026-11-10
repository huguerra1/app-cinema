import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AddressService } from './address.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('AddressService', () => {
  let service: AddressService;
  let prisma: ReturnType<typeof createPrismaMock>;
  const userId = 'cliente';
  const address = {
    street: 'Rua A',
    number: 1,
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000000',
  };

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [AddressService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(AddressService);
  });

  it('lista apenas endereços próprios sem incluir dados de usuários', async () => {
    await service.findAll(userId);
    expect(prisma.address.findMany).toHaveBeenCalledWith({ where: { userId } });
  });

  it('cria com o userId autenticado', async () => {
    await service.create(address, userId);
    expect(prisma.address.create).toHaveBeenCalledWith({
      data: { ...address, userId },
    });
  });

  it('rejeita criar endereço em nome de outro usuário', () => {
    expect(() =>
      service.create({ ...address, userId: 'outro' }, userId),
    ).toThrow(ForbiddenException);
    expect(prisma.address.create).not.toHaveBeenCalled();
  });

  it('rejeita transferir endereço para outro usuário', async () => {
    await expect(
      service.update('endereço', { userId: 'outro' }, userId),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.address.update).not.toHaveBeenCalled();
  });

  it.each(['findOne', 'remove'] as const)(
    'não acessa endereço alheio via %s',
    async (method) => {
      prisma.address.findFirst.mockResolvedValue(null);
      await expect(service[method]('alheio', userId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.address.findFirst).toHaveBeenCalledWith({
        where: { id: 'alheio', userId },
      });
      expect(prisma.address.delete).not.toHaveBeenCalled();
    },
  );

  it('não atualiza endereço alheio', async () => {
    prisma.address.findFirst.mockResolvedValue(null);
    await expect(
      service.update('alheio', { city: 'Outra' }, userId),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.address.update).not.toHaveBeenCalled();
  });
});
