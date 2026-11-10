import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    this.checkUserId(createOrderDto.userId, userId);
    const { ticketIds = [], snackCombos = [] } = createOrderDto;
    let total = 0;

    // Confirma a existência do usuário autenticado.
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Calcula o total dos ingressos disponíveis.
    if (ticketIds.length > 0) {
      const tickets = await this.prisma.ticket.findMany({
        where: { id: { in: ticketIds } },
      });
      if (tickets.length !== ticketIds.length) {
        throw new NotFoundException('One or more tickets were not found.');
      }
      for (const ticket of tickets) {
        if (ticket.orderId) {
          throw new BadRequestException(
            `Ticket ${ticket.id} is already part of an order.`,
          );
        }
        total += ticket.price;
      }
    }

    // Calcula o total dos combos.
    if (snackCombos.length > 0) {
      const snackComboIds = snackCombos.map((s) => s.snackComboId);
      const foundSnacks = await this.prisma.snackCombo.findMany({
        where: { id: { in: snackComboIds } },
      });
      if (foundSnacks.length !== snackComboIds.length) {
        throw new NotFoundException('One or more snack combos were not found.');
      }
      for (const combo of snackCombos) {
        const snack = foundSnacks.find((s) => s.id === combo.snackComboId);
        if (!snack) {
          throw new NotFoundException(
            `Snack combo ${combo.snackComboId} not found.`,
          );
        }
        total += snack.price * combo.quantity;
      }
    }

    const createdOrder = await this.prisma.order.create({
      data: {
        total,
        userId,
        tickets: {
          connect: ticketIds.map((id) => ({ id })),
        },
        snackCombos: {
          create: snackCombos.map((combo) => ({
            quantity: combo.quantity,
            snackCombo: {
              connect: { id: combo.snackComboId },
            },
          })),
        },
      },
      include: {
        tickets: true,
        snackCombos: { include: { snackCombo: true } },
      },
    });

    return createdOrder;
  }

  findAllByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        tickets: {
          include: {
            session: {
              include: {
                movie: true,
              },
            },
          },
        },
        snackCombos: { include: { snackCombo: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        tickets: {
          include: {
            session: {
              include: {
                movie: true,
              },
            },
          },
        },
        snackCombos: { include: { snackCombo: true } },
      },
    });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    return order;
  }

  private checkUserId(bodyUserId: string | undefined, userId: string) {
    if (bodyUserId !== undefined && bodyUserId !== userId) {
      throw new ForbiddenException(
        'O pedido deve pertencer ao usuário autenticado.',
      );
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, userId: string) {
    this.checkUserId(updateOrderDto.userId, userId);
    await this.findOne(id, userId);
    // Alterar itens exige recalcular o total e reservar ingressos em transação.
    if (
      updateOrderDto.ticketIds !== undefined ||
      updateOrderDto.snackCombos !== undefined
    ) {
      throw new BadRequestException(
        'A alteração de itens de um pedido ainda não é suportada.',
      );
    }
    return this.prisma.order.update({
      where: { id, userId },
      data: { userId },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.$transaction(async (tx) => {
      await tx.snackCombosOnOrders.deleteMany({
        where: { orderId: id },
      });
      return tx.order.delete({ where: { id, userId } });
    });
  }
}
