import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createRoomDto: CreateRoomDto): import("@prisma/client").Prisma.Prisma__RoomClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__RoomClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateRoomDto: UpdateRoomDto): import("@prisma/client").Prisma.Prisma__RoomClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__RoomClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        capacity: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
