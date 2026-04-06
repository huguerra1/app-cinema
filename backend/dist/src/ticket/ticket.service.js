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
exports.TicketService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TicketService = class TicketService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTicketDto) {
        const { sessionId, seat } = createTicketDto;
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            include: { room: true },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${sessionId} not found.`);
        }
        const ticketCount = await this.prisma.ticket.count({
            where: { sessionId },
        });
        if (ticketCount >= session.room.capacity) {
            throw new common_1.ConflictException('The session is already at full capacity.');
        }
        const existingTicket = await this.prisma.ticket.findFirst({
            where: { sessionId, seat },
        });
        if (existingTicket) {
            throw new common_1.ConflictException(`Seat ${seat} is already taken for this session.`);
        }
        return this.prisma.ticket.create({
            data: createTicketDto,
        });
    }
    findAll() {
        return this.prisma.ticket.findMany();
    }
    findOne(id) {
        return this.prisma.ticket.findUnique({ where: { id } });
    }
    update(id, updateTicketDto) {
        return this.prisma.ticket.update({
            where: { id },
            data: updateTicketDto,
        });
    }
    remove(id) {
        return this.prisma.ticket.delete({ where: { id } });
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketService);
//# sourceMappingURL=ticket.service.js.map