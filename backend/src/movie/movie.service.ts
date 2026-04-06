import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: createMovieDto,
    });
  }

  findAll() {
    return this.prisma.movie.findMany({ include: { genre: true } });
  }

  findOne(id: string) {
    return this.prisma.movie.findUnique({
      where: { id },
      include: { genre: true },
    });
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  remove(id: string) {
    return this.prisma.movie.delete({ where: { id } });
  }
}
