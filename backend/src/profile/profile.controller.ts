import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create() {
    return this.profileService.denyMutation();
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.profileService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.profileService.findOne(id, user.sub);
  }

  @Patch(':id')
  update() {
    return this.profileService.denyMutation();
  }

  @Delete(':id')
  remove() {
    return this.profileService.denyMutation();
  }
}
