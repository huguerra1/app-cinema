import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Adicione esta linha

@Module({
  imports: [PrismaModule], // <-- Adicione o PrismaModule aqui
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}