import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProfileDto): import("@prisma/client").Prisma.Prisma__ProfileClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        users: {
            email: string;
            password: string;
            name: string;
            profileId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ProfileClient<({
        users: {
            email: string;
            password: string;
            name: string;
            profileId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateProfileDto): import("@prisma/client").Prisma.Prisma__ProfileClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ProfileClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
