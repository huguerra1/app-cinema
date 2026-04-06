import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
// 1. Importe o PrismaModule aqui em cima:
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  // 2. Coloque ele dentro dos imports:
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}