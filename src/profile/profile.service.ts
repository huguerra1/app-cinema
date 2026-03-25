import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProfileDto) { return this.prisma.profile.create({ data }); }
  findAll() { return this.prisma.profile.findMany({ include: { users: true } }); }
  findOne(id: string) { return this.prisma.profile.findUnique({ where: { id }, include: { users: true } }); }
  update(id: string, data: UpdateProfileDto) { return this.prisma.profile.update({ where: { id }, data }); }
  remove(id: string) { return this.prisma.profile.delete({ where: { id } }); }
}