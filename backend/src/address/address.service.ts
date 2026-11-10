import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  private checkUserId(bodyUserId: string | undefined, userId: string) {
    if (bodyUserId !== undefined && bodyUserId !== userId) {
      throw new ForbiddenException(
        'O endereço deve pertencer ao usuário autenticado.',
      );
    }
  }

  create(data: CreateAddressDto, userId: string) {
    this.checkUserId(data.userId, userId);
    const { street, number, city, state, zipCode } = data;
    return this.prisma.address.create({
      data: { street, number, city, state, zipCode, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.address.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!address) {
      throw new NotFoundException('Endereço não encontrado.');
    }
    return address;
  }

  async update(id: string, data: UpdateAddressDto, userId: string) {
    this.checkUserId(data.userId, userId);
    await this.findOne(id, userId);
    const { street, number, city, state, zipCode } = data;
    return this.prisma.address.update({
      where: { id, userId },
      data: { street, number, city, state, zipCode },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.address.delete({ where: { id, userId } });
  }
}
