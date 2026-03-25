import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
  let targetProfileId = data.profileId;

  // Se o profileId não for enviado ou for vazio
  if (!targetProfileId) {
    const defaultProfile = await this.prisma.profile.findFirst({
      where: { name: 'USER' }, // Busca o perfil chamado USER
    });

    if (!defaultProfile) {
      throw new Error('Perfil padrão "USER" não encontrado no banco. Crie-o primeiro!');
    }
    
    targetProfileId = defaultProfile.id;
  }

  return this.prisma.user.create({
    data: {
      ...data,
      profileId: targetProfileId,
    },
  });
}
  findAll() { return this.prisma.user.findMany({ include: { profile: true, address: true } }); }
  findOne(id: string) { return this.prisma.user.findUnique({ where: { id }, include: { profile: true, address: true } }); }
  update(id: string, data: UpdateUserDto) { return this.prisma.user.update({ where: { id }, data }); }
  remove(id: string) { return this.prisma.user.delete({ where: { id } }); }
}