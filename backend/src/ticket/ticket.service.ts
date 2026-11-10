import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto, userId: string) {
    const { sessionId, seat, orderId } = createTicketDto;
    if (orderId !== undefined) {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId, userId },
      });
      if (!order) {
        throw new ForbiddenException(
          'O pedido deve pertencer ao usuário autenticado.',
        );
      }
    }

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { room: true },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found.`);
    }

    const ticketCount = await this.prisma.ticket.count({
      where: { sessionId },
    });

    if (ticketCount >= session.room.capacity) {
      throw new ConflictException('The session is already at full capacity.');
    }

    const existingTicket = await this.prisma.ticket.findFirst({
      where: { sessionId, seat },
    });

    if (existingTicket) {
      throw new ConflictException(
        `Seat ${seat} is already taken for this session.`,
      );
    }

    return this.prisma.ticket.create({
      data: { sessionId, seat, price: session.price, orderId },
    });
  }

  findAll(userId: string) {
    return this.prisma.ticket.findMany({
      where: { order: { userId } },
      include: {
        session: {
          include: {
            movie: true,
            room: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, order: { userId } },
    });
    if (!ticket) {
      throw new NotFoundException('Ingresso não encontrado.');
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, userId: string) {
    const ticket = await this.findOne(id, userId);
    if (
      updateTicketDto.orderId !== undefined &&
      updateTicketDto.orderId !== ticket.orderId
    ) {
      throw new ForbiddenException(
        'Não é permitido transferir um ingresso entre pedidos.',
      );
    }
    // Um ingresso comprado mantém sua sessão e preço; o cliente não pode reprecificá-lo.
    if (
      updateTicketDto.sessionId !== undefined &&
      updateTicketDto.sessionId !== ticket.sessionId
    ) {
      throw new ForbiddenException(
        'Não é permitido trocar a sessão do ingresso.',
      );
    }
    const { seat } = updateTicketDto;
    return this.prisma.ticket.update({
      where: { id, order: { userId } },
      data: { seat },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.ticket.delete({ where: { id, order: { userId } } });
  }
}
