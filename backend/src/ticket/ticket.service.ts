import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

    try {
      return await this.prisma.$transaction(
        async (tx) => {
          // Serializa as compras da mesma sessão antes de consultar a lotação.
          await tx.$queryRaw`
            SELECT "id" FROM "Session" WHERE "id" = ${sessionId} FOR UPDATE
          `;
          const session = await tx.session.findUnique({
            where: { id: sessionId },
            include: { room: true },
          });

          if (!session) {
            throw new NotFoundException(
              `Session with ID ${sessionId} not found.`,
            );
          }

          const ticketCount = await tx.ticket.count({ where: { sessionId } });
          if (ticketCount >= session.room.capacity) {
            throw new ConflictException('Sessão lotada.');
          }

          // O índice único no banco decide a disputa pelo assento.
          return tx.ticket.create({
            data: { sessionId, seat, price: session.price, orderId },
          });
        },
        // Após esperar o bloqueio, a contagem precisa enxergar a compra anterior.
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('assento já ocupado');
      }
      throw error;
    }
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
