import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: createPrismaMock() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('é instanciado sem banco de dados', () => {
    expect(service).toBeDefined();
  });
});
