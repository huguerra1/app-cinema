import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Adicione esta linha

@Module({
  imports: [PrismaModule], // <-- Adicione o PrismaModule aqui
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}