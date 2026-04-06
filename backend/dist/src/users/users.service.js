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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        let targetProfileId = data.profileId;
        if (!targetProfileId) {
            const defaultProfile = await this.prisma.profile.findFirst({
                where: { name: 'USER' },
            });
            if (!defaultProfile) {
                throw new Error('Perfil padrão "USER" não encontrado no banco. Crie-o primeiro!');
            }
            targetProfileId = defaultProfile.id;
        }
        return this.prisma.user.create({
            data: {
                ...data,
                profileId: targetProfileId,
            },
        });
    }
    findAll() { return this.prisma.user.findMany({ include: { profile: true, address: true } }); }
    findOne(id) { return this.prisma.user.findUnique({ where: { id }, include: { profile: true, address: true } }); }
    update(id, data) { return this.prisma.user.update({ where: { id }, data }); }
    remove(id) { return this.prisma.user.delete({ where: { id } }); }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map