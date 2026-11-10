import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

describe('AddressController', () => {
  let controller: AddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'segredo-exclusivo-dos-testes' })],
      controllers: [AddressController],
      providers: [
        AddressService,
        { provide: PrismaService, useValue: createPrismaMock() },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
  });

  it('é instanciado sem banco de dados', () => {
    expect(controller).toBeDefined();
  });
});
