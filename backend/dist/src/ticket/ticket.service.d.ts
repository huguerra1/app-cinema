import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
export declare class TicketService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTicketDto: CreateTicketDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        seat: string;
        sessionId: string;
        orderId: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        seat: string;
        sessionId: string;
        orderId: string | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__TicketClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        seat: string;
        sessionId: string;
        orderId: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateTicketDto: UpdateTicketDto): import("@prisma/client").Prisma.Prisma__TicketClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        seat: string;
        sessionId: string;
        orderId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__TicketClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        seat: string;
        sessionId: string;
        orderId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
