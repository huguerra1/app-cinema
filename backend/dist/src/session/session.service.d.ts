import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
export declare class SessionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createSessionDto: CreateSessionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        movieId: string;
        roomId: string;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        movie: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            durationMinutes: number;
            synopsis: string;
            genreId: string;
        };
        room: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            capacity: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        movieId: string;
        roomId: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__SessionClient<({
        movie: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            durationMinutes: number;
            synopsis: string;
            genreId: string;
        };
        room: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            capacity: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        movieId: string;
        roomId: string;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateSessionDto: UpdateSessionDto): import("@prisma/client").Prisma.Prisma__SessionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        movieId: string;
        roomId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__SessionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        movieId: string;
        roomId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
