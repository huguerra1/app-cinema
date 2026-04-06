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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            snackComboId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            email: string;
            password: string;
            name: string;
            profileId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            snackComboId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        user: {
            email: string;
            password: string;
            name: string;
            profileId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            snackComboId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateOrderDto: UpdateOrderDto): import("@prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        total: number;
    }>;
}
