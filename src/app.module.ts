import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [PrismaModule, UsersModule, ProfileModule, AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
