import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, ticketIds = [], snackCombos = [] } = createOrderDto;
    let total = 0;

    // Validate User
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // Handle Tickets
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

    // Handle Snack Combos
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
          throw new NotFoundException(`Snack combo ${combo.snackComboId} not found.`);
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

  findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        tickets: true, // Aqui ele traz apenas a Cadeira e Preço
        snackCombos: { include: { snackCombo: true } },
      },
    });
  }
  // Novo método para buscar apenas a lista de pedidos de um usuário específico
  findAllByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId: userId }, // <-- O filtro que barra pedidos de outras pessoas
      include: {
        user: true,
        tickets: {
          include: {
            session: {
              include: {
                movie: true // Aqui trazemos o nome do filme bonitão!
              }
            }
          }
        },
        snackCombos: { include: { snackCombo: true } },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        tickets: {
          include: {
            session: {
              include: {
                movie: true
              }
            }
          }
        },
        snackCombos: { include: { snackCombo: true } },
      },
    });
  }

  // Updating an order's contents is complex and would require its own logic
  // for adding/removing items and recalculating totals.
  // This is a placeholder implementation.
  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto as any,
    });
  }

  remove(id: string) {
    // Must also remove related SnackCombosOnOrders due to relation
    return this.prisma.$transaction(async (tx) => {
      await tx.snackCombosOnOrders.deleteMany({
        where: { orderId: id },
      });
      return tx.order.delete({ where: { id } });
    });
  }
}
