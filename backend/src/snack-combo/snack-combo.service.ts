import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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

  findOne(id: string) {
    return this.prisma.snackCombo.findUnique({ where: { id } });
  }

  update(id: string, updateSnackComboDto: UpdateSnackComboDto) {
    return this.prisma.snackCombo.update({
      where: { id },
      data: updateSnackComboDto,
    });
  }

  remove(id: string) {
    return this.prisma.snackCombo.delete({ where: { id } });
  }
}
