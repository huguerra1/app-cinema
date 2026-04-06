import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateAddressDto): import("@prisma/client").Prisma.Prisma__AddressClient<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
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
    } & {
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        userId: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__AddressClient<({
        user: {
            email: string;
            password: string;
            name: string;
            profileId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        userId: string;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateAddressDto): import("@prisma/client").Prisma.Prisma__AddressClient<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__AddressClient<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        userId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
