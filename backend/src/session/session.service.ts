import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto) {
    const { startTime, movieId, roomId } = createSessionDto;

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

      // Check for overlap: (StartA < EndB) and (StartB < EndA)
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
      },
    });
  }

  findAll() {
    return this.prisma.session.findMany({ include: { movie: true, room: true } });
  }

  findOne(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
      include: { movie: true, room: true },
    });
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    return this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
  }

  remove(id: string) {
    return this.prisma.session.delete({ where: { id } });
  }
}
