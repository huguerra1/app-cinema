import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSnackComboDto } from './dto/create-snack-combo.dto';
import { UpdateSnackComboDto } from './dto/update-snack-combo.dto';
export declare class SnackComboService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createSnackComboDto: CreateSnackComboDto): import("@prisma/client").Prisma.Prisma__SnackComboClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__SnackComboClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateSnackComboDto: UpdateSnackComboDto): import("@prisma/client").Prisma.Prisma__SnackComboClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__SnackComboClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
