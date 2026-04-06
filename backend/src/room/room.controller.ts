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
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all rooms' })
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a room by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a room by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roomService.remove(id);
  }
}
