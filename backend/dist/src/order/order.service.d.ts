import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrderService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto): Promise<{
        tickets: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            seat: string;
            sessionId: string;
            orderId: string | null;
        }[];
        snackCombos: ({
            snackCombo: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                name: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            quantity: number;
            snackComboId: string;
        })[];
    } & {
        id: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            password: string;
            profileId: string;
        };
        tickets: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            seat: string;
            sessionId: string;
            orderId: string | null;
        }[];
        snackCombos: ({
            snackCombo: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                name: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            quantity: number;
            snackComboId: string;
        })[];
    } & {
        id: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findAllByUserId(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            password: string;
            profileId: string;
        };
        tickets: ({
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
            createdAt: Date;
            updatedAt: Date;
            price: number;
            seat: string;
            sessionId: string;
            orderId: string | null;
        })[];
        snackCombos: ({
            snackCombo: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                name: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            quantity: number;
            snackComboId: string;
        })[];
    } & {
        id: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            password: string;
            profileId: string;
        };
        tickets: ({
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
            createdAt: Date;
            updatedAt: Date;
            price: number;
            seat: string;
            sessionId: string;
            orderId: string | null;
        })[];
        snackCombos: ({
            snackCombo: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                name: string;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            quantity: number;
            snackComboId: string;
        })[];
    } & {
        id: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateOrderDto: UpdateOrderDto): import("@prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): Promise<{
        id: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
