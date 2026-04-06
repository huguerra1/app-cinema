import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
// 1. Adicione a linha abaixo para importar o PrismaModule:
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  // 2. Coloque o PrismaModule dentro desta lista de imports:
  imports: [PrismaModule], 
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}