import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Certifique-se de que o Prisma está importado lá em cima!

@Module({
  imports: [
    PrismaModule, // <-- ELE PRECISA ESTAR AQUI JUNTO COM O JWT!
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error(
            'JWT_SECRET não definido. Copie .env.example para .env e defina um valor.',
          );
        }
        return { secret, signOptions: { expiresIn: '1d' } };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}