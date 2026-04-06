import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({
      data: createRoomDto,
    });
  }

  findAll() {
    return this.prisma.room.findMany();
  }

  findOne(id: string) {
    return this.prisma.room.findUnique({ where: { id } });
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  remove(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }
}
