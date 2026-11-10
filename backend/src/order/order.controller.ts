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
  ForbiddenException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/current-user.decorator';

@ApiTags('order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um pedido para o usuário autenticado' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: JwtPayload) {
    return this.orderService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Listar os próprios pedidos' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.orderService.findAllByUserId(user.sub);
  }

  @Get('me')
  @ApiOperation({ summary: 'Listar os pedidos do usuário autenticado' })
  findMine(@CurrentUser() user: JwtPayload) {
    return this.orderService.findAllByUserId(user.sub);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Consultar os próprios pedidos pela rota legada' })
  findAllByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    if (userId !== user.sub) {
      throw new ForbiddenException(
        'Não é permitido consultar pedidos de outro usuário.',
      );
    }
    return this.orderService.findAllByUserId(user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.orderService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.orderService.update(id, dto, user.sub);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.orderService.remove(id, user.sub);
  }
}
