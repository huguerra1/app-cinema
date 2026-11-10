import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthRequest } from './current-user.decorator';

describe('JwtAuthGuard', () => {
  const payload = { sub: '11111111-1111-4111-8111-111111111111', role: 'USER' };
  const jwt = new JwtService({ secret: 'segredo-exclusivo-dos-testes' });
  const guard = new JwtAuthGuard(jwt);

  function context(authorization?: string) {
    const request = { headers: { authorization } } as AuthRequest;
    const executionContext = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;
    return { request, executionContext };
  }

  it.each([undefined, '', 'Basic abc', 'Bearer', 'Bearer abc extra'])(
    'retorna 401 sem um Bearer válido: %s',
    async (authorization) => {
      const { executionContext } = context(authorization);
      await expect(guard.canActivate(executionContext)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    },
  );

  it('retorna 401 para token inválido', async () => {
    const { request, executionContext } = context('Bearer invalido');
    await expect(guard.canActivate(executionContext)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(request.user).toBeUndefined();
  });

  it('retorna 401 para uma assinatura de outro segredo', async () => {
    const token = await new JwtService({ secret: 'outro-segredo' }).signAsync(
      payload,
    );
    await expect(
      guard.canActivate(context('Bearer ' + token).executionContext),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('retorna 401 para token expirado', async () => {
    const token = await jwt.signAsync(payload, { expiresIn: -1 });
    await expect(
      guard.canActivate(context('Bearer ' + token).executionContext),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it.each([{}, { sub: 123 }, { sub: 'outro-id' }])(
    'rejeita payload sem identificador de usuário válido: %j',
    async (claims) => {
      const token = await jwt.signAsync(claims);
      await expect(
        guard.canActivate(context('Bearer ' + token).executionContext),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    },
  );

  it('aceita token válido e coloca o payload verificado em request.user', async () => {
    const token = await jwt.signAsync(payload);
    const { request, executionContext } = context('Bearer ' + token);
    await expect(guard.canActivate(executionContext)).resolves.toBe(true);
    expect(request.user).toEqual(expect.objectContaining(payload));
  });
});
