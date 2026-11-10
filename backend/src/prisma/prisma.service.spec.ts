import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { createPrismaMock } from './prisma.mock';

describe('PrismaService', () => {
  it('permite substituir o cliente por um mock sem conexão com o banco', async () => {
    const prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();
    expect(module.get(PrismaService)).toBe(prisma);
    expect(prisma.$connect).not.toHaveBeenCalled();
  });

  it('chama a conexão no ciclo de inicialização', async () => {
    const prisma = createPrismaMock();
    await PrismaService.prototype.onModuleInit.call(prisma);
    expect(prisma.$connect).toHaveBeenCalledTimes(1);
  });
});
