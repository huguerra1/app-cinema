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
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tickets' })
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ticket by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket by ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.remove(id);
  }
}
