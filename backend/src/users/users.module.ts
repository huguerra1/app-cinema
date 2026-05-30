import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Certifique-se de que o Prisma está importado lá em cima!

@Module({
  imports: [
    PrismaModule, // <-- ELE PRECISA ESTAR AQUI JUNTO COM O JWT!
    JwtModule.register({
      global: true,
      secret: 'MINHA_CHAVE_SECRETA_CINEGESTAO_2026', 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}