import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
// 1. Importe o Prisma
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  // 2. Coloque no array
  imports: [PrismaModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}