import { Module } from '@nestjs/common';
import { SnackComboService } from './snack-combo.service';
import { SnackComboController } from './snack-combo.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SnackComboController],
  providers: [SnackComboService],
})
export class SnackComboModule {}
