import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateUserDto): Promise<{
        email: string;
        password: string;
        name: string;
        profileId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        profile: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        address: {
            number: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            street: string;
            city: string;
            state: string;
            zipCode: string;
            userId: string;
        } | null;
    } & {
        email: string;
        password: string;
        name: string;
        profileId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__UserClient<({
        profile: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        address: {
            number: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            street: string;
            city: string;
            state: string;
            zipCode: string;
            userId: string;
        } | null;
    } & {
        email: string;
        password: string;
        name: string;
        profileId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        password: string;
        name: string;
        profileId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        email: string;
        password: string;
        name: string;
        profileId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
