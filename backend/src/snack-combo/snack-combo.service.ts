import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSnackComboDto } from './dto/create-snack-combo.dto';
import { UpdateSnackComboDto } from './dto/update-snack-combo.dto';

@Injectable()
export class SnackComboService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSnackComboDto: CreateSnackComboDto) {
    return this.prisma.snackCombo.create({
      data: createSnackComboDto,
    });
  }

  findAll() {
    return this.prisma.snackCombo.findMany();
  }

  async findOne(id: string) {
    const result = await this.prisma.snackCombo.findUnique({ where: { id } });
    if (!result) {
      throw new NotFoundException('Combo não encontrado.');
    }
    return result;
  }

  async update(id: string, updateSnackComboDto: UpdateSnackComboDto) {
    await this.findOne(id);
    return this.prisma.snackCombo.update({
      where: { id },
      data: updateSnackComboDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.snackCombo.delete({ where: { id } });
  }
}
