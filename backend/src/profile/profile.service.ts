import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  // Os perfis são papéis compartilhados, não dados pessoais editáveis.
  denyMutation(): never {
    throw new ForbiddenException(
      'A gestão de perfis requer autorização administrativa.',
    );
  }

  findAll(userId: string) {
    return this.prisma.profile.findMany({
      where: { users: { some: { id: userId } } },
    });
  }

  async findOne(id: string, userId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: { id, users: { some: { id: userId } } },
    });
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }
    return profile;
  }
}
