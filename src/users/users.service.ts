import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto) { return this.prisma.user.create({ data }); }
  findAll() { return this.prisma.user.findMany({ include: { profile: true, address: true } }); }
  findOne(id: string) { return this.prisma.user.findUnique({ where: { id }, include: { profile: true, address: true } }); }
  update(id: string, data: UpdateUserDto) { return this.prisma.user.update({ where: { id }, data }); }
  remove(id: string) { return this.prisma.user.delete({ where: { id } }); }
}