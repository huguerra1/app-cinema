import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'segredo-exclusivo-dos-testes' })],
      controllers: [ProfileController],
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: createPrismaMock() },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('é instanciado sem banco de dados', () => {
    expect(controller).toBeDefined();
  });
});
