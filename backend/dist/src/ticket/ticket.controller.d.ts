import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    create(createTicketDto: CreateTicketDto): Promise<{
        id: string;
        price: number;
        seat: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        orderId: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        session: {
            movie: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                durationMinutes: number;
                synopsis: string;
                genreId: string;
            };
            room: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                capacity: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: Date;
            movieId: string;
            roomId: string;
        };
    } & {
        id: string;
        price: number;
        seat: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        orderId: string | null;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__TicketClient<{
        id: string;
        price: number;
        seat: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        orderId: string | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateTicketDto: UpdateTicketDto): import("@prisma/client").Prisma.Prisma__TicketClient<{
        id: string;
        price: number;
        seat: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        orderId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__TicketClient<{
        id: string;
        price: number;
        seat: string;
        createdAt: Date;
        updatedAt: Date;
        sessionId: string;
        orderId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
