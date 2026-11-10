import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { SnackComboService } from './snack-combo.service';
import { CreateSnackComboDto } from './dto/create-snack-combo.dto';
import { UpdateSnackComboDto } from './dto/update-snack-combo.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('snack-combo')
@Controller('snack-combo')
export class SnackComboController {
  constructor(private readonly snackComboService: SnackComboService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new snack combo' })
  create(@Body() createSnackComboDto: CreateSnackComboDto) {
    return this.snackComboService.create(createSnackComboDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all snack combos' })
  findAll() {
    return this.snackComboService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a snack combo by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.snackComboService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a snack combo by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSnackComboDto: UpdateSnackComboDto,
  ) {
    return this.snackComboService.update(id, updateSnackComboDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a snack combo by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.snackComboService.remove(id);
  }
}
