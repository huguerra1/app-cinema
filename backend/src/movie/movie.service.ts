import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  async findOne(id: string) {
    const result = await this.prisma.movie.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!result) {
      throw new NotFoundException('Filme não encontrado.');
    }
    return result;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    await this.findOne(id);
    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.movie.delete({ where: { id } });
  }
}
