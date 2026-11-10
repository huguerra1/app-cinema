import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';
import type { AuthRequest, JwtPayload } from './current-user.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    delete request.user;
    const authorization = request.headers.authorization;
    const match = authorization?.match(/^Bearer ([^\s]+)$/i);
    if (!match) {
      throw new UnauthorizedException('Token Bearer necessário.');
    }

    try {
      // Usa a mesma configuração e o mesmo segredo da emissão no login.
      const payload = await this.jwtService.verifyAsync<JwtPayload>(match[1]);
      if (!payload || typeof payload.sub !== 'string' || !isUUID(payload.sub)) {
        throw new Error('Identificador de usuário inválido.');
      }
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
