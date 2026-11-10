import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  [claim: string]: unknown;
}

export type AuthRequest = Request & { user?: JwtPayload };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload => {
    const { user } = context.switchToHttp().getRequest<AuthRequest>();
    if (!user) {
      throw new UnauthorizedException('Autenticação necessária.');
    }
    return user;
  },
);
