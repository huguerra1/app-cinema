import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock } from '../prisma/prisma.mock';
import type { AuthRequest } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const jwt = new JwtService({ secret: 'segredo-dos-testes' });
  const sub = '11111111-1111-4111-8111-111111111111';
  let prisma: ReturnType<typeof createPrismaMock>;
  let guard: RolesGuard;

  class Catalog {
    @Roles('ADMIN')
    write(this: void) {}
    read(this: void) {}
  }

  beforeEach(() => {
    prisma = createPrismaMock();
    guard = new RolesGuard(new Reflector(), prisma as unknown as PrismaService);
  });

  function context(
    user?: AuthRequest['user'],
    handler = Catalog.prototype.write,
  ) {
    const request = { user, headers: {} } as AuthRequest;
    const ctx = {
      getHandler: () => handler,
      getClass: () => Catalog,
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;
    return { request, ctx };
  }

  it('JwtAuthGuard retorna 401 antes do RolesGuard quando falta token', async () => {
    const { ctx } = context();
    await expect(new JwtAuthGuard(jwt).canActivate(ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('também falha fechado sem usuário autenticado', async () => {
    await expect(guard.canActivate(context().ctx)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('retorna 403 para USER', async () => {
    await expect(
      guard.canActivate(context({ sub, role: 'USER' }).ctx),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('aceita ADMIN de um JWT validado', async () => {
    const { request, ctx } = context();
    request.headers.authorization =
      'Bearer ' + (await jwt.signAsync({ sub, role: 'ADMIN' }));
    await new JwtAuthGuard(jwt).canActivate(ctx);
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it.each(['ADMIN', 'USER', null])(
    'consulta o banco pelo sub para token antigo: %s',
    async (role) => {
      prisma.user.findUnique.mockResolvedValue(
        role ? { profile: { name: role } } : null,
      );
      const result = guard.canActivate(context({ sub }).ctx);
      if (role === 'ADMIN') await expect(result).resolves.toBe(true);
      else await expect(result).rejects.toBeInstanceOf(ForbiddenException);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: sub },
        select: { profile: { select: { name: true } } },
      });
    },
  );

  it('não exige papel em leitura sem decorator', async () => {
    await expect(
      guard.canActivate(context(undefined, Catalog.prototype.read).ctx),
    ).resolves.toBe(true);
  });
});
