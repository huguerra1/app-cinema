import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        profileId: string;
    }>;
    login(body: any): Promise<{
        profile: {
            id: string;
            name: string;
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
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        profileId: string;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        profile: {
            id: string;
            name: string;
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
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        profileId: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__UserClient<({
        profile: {
            id: string;
            name: string;
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
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        profileId: string;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateUserDto: UpdateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        profileId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        password: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        profileId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
