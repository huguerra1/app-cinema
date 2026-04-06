import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SnackComboService } from './snack-combo.service';
import { CreateSnackComboDto } from './dto/create-snack-combo.dto';
import { UpdateSnackComboDto } from './dto/update-snack-combo.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('snack-combo')
@Controller('snack-combo')
export class SnackComboController {
  constructor(private readonly snackComboService: SnackComboService) {}

  @Post()
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
  @ApiOperation({ summary: 'Update a snack combo by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSnackComboDto: UpdateSnackComboDto,
  ) {
    return this.snackComboService.update(id, updateSnackComboDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a snack combo by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.snackComboService.remove(id);
  }
}
