import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    const { startTime, movieId, roomId, price } = createSessionDto;

    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found.`);
    }

    const newStartTime = new Date(startTime);
    const newEndTime = addMinutes(newStartTime, movie.durationMinutes);

    const roomSessions = await this.prisma.session.findMany({
      where: { roomId },
      include: { movie: true },
    });

    for (const session of roomSessions) {
      const existingStartTime = session.startTime;
      const existingEndTime = addMinutes(
        existingStartTime,
        session.movie.durationMinutes,
      );

      // Há sobreposição quando o início de cada sessão precede o fim da outra.
      if (newStartTime < existingEndTime && existingStartTime < newEndTime) {
        throw new ConflictException(
          'Session time conflicts with an existing session.',
        );
      }
    }

    return this.prisma.session.create({
      data: {
        startTime: newStartTime,
        movieId,
        roomId,
        price,
      },
    });
  }

  findAll() {
    return this.prisma.session.findMany({
      include: { movie: true, room: true },
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.session.findUnique({
      where: { id },
      include: { movie: true, room: true },
    });
    if (!result) {
      throw new NotFoundException('Sessão não encontrada.');
    }
    return result;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    await this.findOne(id);
    return this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.session.delete({ where: { id } });
  }
}
