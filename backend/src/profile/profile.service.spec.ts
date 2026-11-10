import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [ProfileService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(ProfileService);
  });

  it('lista apenas o papel do usuário autenticado sem expor outros usuários', async () => {
    await service.findAll('cliente');
    expect(prisma.profile.findMany).toHaveBeenCalledWith({
      where: { users: { some: { id: 'cliente' } } },
    });
  });

  it('não retorna um perfil que não pertence ao usuário autenticado', async () => {
    prisma.profile.findFirst.mockResolvedValue(null);
    await expect(
      service.findOne('perfil-alheio', 'cliente'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.profile.findFirst).toHaveBeenCalledWith({
      where: { id: 'perfil-alheio', users: { some: { id: 'cliente' } } },
    });
  });

  it('impede alterações de papéis compartilhados até haver autorização administrativa', () => {
    expect(() => service.denyMutation()).toThrow(ForbiddenException);
    expect(prisma.profile.create).not.toHaveBeenCalled();
    expect(prisma.profile.update).not.toHaveBeenCalled();
    expect(prisma.profile.delete).not.toHaveBeenCalled();
  });
});
