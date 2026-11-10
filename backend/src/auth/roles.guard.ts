import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthRequest } from './current-user.decorator';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;

    const { user } = context.switchToHttp().getRequest<AuthRequest>();
    if (!user) throw new UnauthorizedException('Autenticação necessária.');

    let role = user.role;
    if (typeof role !== 'string' || !role) {
      // Tokens antigos sem papel exigem consultar o perfil atual pelo sub.
      const account = await this.prisma.user.findUnique({
        where: { id: user.sub },
        select: { profile: { select: { name: true } } },
      });
      role = account?.profile?.name;
    }
    if (typeof role !== 'string' || !roles.includes(role)) {
      throw new ForbiddenException('Perfil sem permissão para esta operação.');
    }
    return true;
  }
}
