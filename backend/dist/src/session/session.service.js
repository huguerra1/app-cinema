"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const prisma_service_1 = require("../prisma/prisma.service");
let SessionService = class SessionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSessionDto) {
        const { startTime, movieId, roomId } = createSessionDto;
        const movie = await this.prisma.movie.findUnique({
            where: { id: movieId },
        });
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID ${movieId} not found.`);
        }
        const newStartTime = new Date(startTime);
        const newEndTime = (0, date_fns_1.addMinutes)(newStartTime, movie.durationMinutes);
        const roomSessions = await this.prisma.session.findMany({
            where: { roomId },
            include: { movie: true },
        });
        for (const session of roomSessions) {
            const existingStartTime = session.startTime;
            const existingEndTime = (0, date_fns_1.addMinutes)(existingStartTime, session.movie.durationMinutes);
            if (newStartTime < existingEndTime && existingStartTime < newEndTime) {
                throw new common_1.ConflictException('Session time conflicts with an existing session.');
            }
        }
        return this.prisma.session.create({
            data: {
                startTime: newStartTime,
                movieId,
                roomId,
            },
        });
    }
    findAll() {
        return this.prisma.session.findMany({ include: { movie: true, room: true } });
    }
    findOne(id) {
        return this.prisma.session.findUnique({
            where: { id },
            include: { movie: true, room: true },
        });
    }
    update(id, updateSessionDto) {
        return this.prisma.session.update({
            where: { id },
            data: updateSessionDto,
        });
    }
    remove(id) {
        return this.prisma.session.delete({ where: { id } });
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionService);
//# sourceMappingURL=session.service.js.map