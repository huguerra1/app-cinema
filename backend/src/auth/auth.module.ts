import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
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
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
