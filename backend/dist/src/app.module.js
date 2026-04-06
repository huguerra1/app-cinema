"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const profile_module_1 = require("./profile/profile.module");
const address_module_1 = require("./address/address.module");
const genre_module_1 = require("./genre/genre.module");
const movie_module_1 = require("./movie/movie.module");
const room_module_1 = require("./room/room.module");
const session_module_1 = require("./session/session.module");
const ticket_module_1 = require("./ticket/ticket.module");
const snack_combo_module_1 = require("./snack-combo/snack-combo.module");
const order_module_1 = require("./order/order.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, users_module_1.UsersModule, profile_module_1.ProfileModule, address_module_1.AddressModule, genre_module_1.GenreModule, movie_module_1.MovieModule, room_module_1.RoomModule, session_module_1.SessionModule, ticket_module_1.TicketModule, snack_combo_module_1.SnackComboModule, order_module_1.OrderModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map