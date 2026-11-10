import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../auth/password';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

function withoutPassword<T extends { password: string }>(user: T) {
  const { password, ...result } = user;
  void password;
  return result;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const defaultProfile = await this.prisma.profile.findFirst({
      where: { name: 'USER' },
    });
    if (!defaultProfile) {
      throw new Error(
        'Perfil padrão "USER" não encontrado no banco. Crie-o primeiro!',
      );
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: await hashPassword(data.password),
          profileId: defaultProfile.id,
        },
      });
      return withoutPassword(user);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async authenticate(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Email ou senha incorretos!');
    }
    if (!user.password.startsWith('scrypt$')) {
      // A condição evita sobrescrever uma senha alterada durante o login.
      await this.prisma.user.update({
        where: { id: user.id, password: user.password },
        data: { password: await hashPassword(password) },
      });
    }
    return withoutPassword(user);
  }

  async findAll(userId: string) {
    const users = await this.prisma.user.findMany({
      where: { id: userId },
      include: { profile: true, address: true },
    });
    return users.map(withoutPassword);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true, address: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return withoutPassword(user);
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        // Campos extras do corpo nunca são repassados ao Prisma.
        data: {
          name: data.name,
          email: data.email,
          ...(data.password !== undefined
            ? { password: await hashPassword(data.password) }
            : {}),
        },
      });
      return withoutPassword(user);
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  async remove(id: string) {
    try {
      return withoutPassword(await this.prisma.user.delete({ where: { id } }));
    } catch (error) {
      this.handleWriteError(error);
    }
  }

  private handleWriteError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email já cadastrado.');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Usuário não encontrado.');
      }
    }
    throw error;
  }
}
