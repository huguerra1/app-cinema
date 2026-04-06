import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGenreDto: CreateGenreDto) {
    return this.prisma.genre.create({
      data: createGenreDto,
    });
  }

  findAll() {
    return this.prisma.genre.findMany();
  }

  findOne(id: string) {
    return this.prisma.genre.findUnique({ where: { id } });
  }

  update(id: string, updateGenreDto: UpdateGenreDto) {
    return this.prisma.genre.update({
      where: { id },
      data: updateGenreDto,
    });
  }

  remove(id: string) {
    return this.prisma.genre.delete({ where: { id } });
  }
}
