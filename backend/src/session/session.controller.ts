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
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all sessions' })
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a session by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionService.remove(id);
  }
}
