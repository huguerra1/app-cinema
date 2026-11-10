import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  async findOne(id: string) {
    const result = await this.prisma.genre.findUnique({ where: { id } });
    if (!result) {
      throw new NotFoundException('Gênero não encontrado.');
    }
    return result;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);
    return this.prisma.genre.update({
      where: { id },
      data: updateGenreDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.genre.delete({ where: { id } });
  }
}
