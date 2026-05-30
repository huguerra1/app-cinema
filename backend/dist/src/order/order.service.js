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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrderService = class OrderService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto) {
        const { userId, ticketIds = [], snackCombos = [] } = createOrderDto;
        let total = 0;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found.`);
        }
        if (ticketIds.length > 0) {
            const tickets = await this.prisma.ticket.findMany({
                where: { id: { in: ticketIds } },
            });
            if (tickets.length !== ticketIds.length) {
                throw new common_1.NotFoundException('One or more tickets were not found.');
            }
            for (const ticket of tickets) {
                if (ticket.orderId) {
                    throw new common_1.BadRequestException(`Ticket ${ticket.id} is already part of an order.`);
                }
                total += ticket.price;
            }
        }
        if (snackCombos.length > 0) {
            const snackComboIds = snackCombos.map((s) => s.snackComboId);
            const foundSnacks = await this.prisma.snackCombo.findMany({
                where: { id: { in: snackComboIds } },
            });
            if (foundSnacks.length !== snackComboIds.length) {
                throw new common_1.NotFoundException('One or more snack combos were not found.');
            }
            for (const combo of snackCombos) {
                const snack = foundSnacks.find((s) => s.id === combo.snackComboId);
                if (!snack) {
                    throw new common_1.NotFoundException(`Snack combo ${combo.snackComboId} not found.`);
                }
                total += snack.price * combo.quantity;
            }
        }
        const createdOrder = await this.prisma.order.create({
            data: {
                total,
                userId,
                tickets: {
                    connect: ticketIds.map((id) => ({ id })),
                },
                snackCombos: {
                    create: snackCombos.map((combo) => ({
                        quantity: combo.quantity,
                        snackCombo: {
                            connect: { id: combo.snackComboId },
                        },
                    })),
                },
            },
            include: {
                tickets: true,
                snackCombos: { include: { snackCombo: true } },
            },
        });
        return createdOrder;
    }
    findAll() {
        return this.prisma.order.findMany({
            include: {
                user: true,
                tickets: true,
                snackCombos: { include: { snackCombo: true } },
            },
        });
    }
    findAllByUserId(userId) {
        return this.prisma.order.findMany({
            where: { userId: userId },
            include: {
                user: true,
                tickets: {
                    include: {
                        session: {
                            include: {
                                movie: true
                            }
                        }
                    }
                },
                snackCombos: { include: { snackCombo: true } },
            },
        });
    }
    findOne(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                tickets: {
                    include: {
                        session: {
                            include: {
                                movie: true
                            }
                        }
                    }
                },
                snackCombos: { include: { snackCombo: true } },
            },
        });
    }
    update(id, updateOrderDto) {
        return this.prisma.order.update({
            where: { id },
            data: updateOrderDto,
        });
    }
    remove(id) {
        return this.prisma.$transaction(async (tx) => {
            await tx.snackCombosOnOrders.deleteMany({
                where: { orderId: id },
            });
            return tx.order.delete({ where: { id } });
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map