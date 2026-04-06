import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    const { sessionId, seat } = createTicketDto;

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
      data: createTicketDto,
    });
  }

  findAll() {
    return this.prisma.ticket.findMany();
  }

  findOne(id: string) {
    return this.prisma.ticket.findUnique({ where: { id } });
  }

  update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
    });
  }

  remove(id: string) {
    return this.prisma.ticket.delete({ where: { id } });
  }
}
