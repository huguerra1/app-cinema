import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
export declare class MovieController {
    private readonly movieService;
    constructor(movieService: MovieService);
    create(createMovieDto: CreateMovieDto): import("@prisma/client").Prisma.Prisma__MovieClient<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        durationMinutes: number;
        synopsis: string;
        genreId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        durationMinutes: number;
        synopsis: string;
        genreId: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__MovieClient<({
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        durationMinutes: number;
        synopsis: string;
        genreId: string;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateMovieDto: UpdateMovieDto): import("@prisma/client").Prisma.Prisma__MovieClient<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        durationMinutes: number;
        synopsis: string;
        genreId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__MovieClient<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        durationMinutes: number;
        synopsis: string;
        genreId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
