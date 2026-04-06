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
exports.CreateTicketDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTicketDto {
    price;
    seat;
    sessionId;
    orderId;
}
exports.CreateTicketDto = CreateTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The price of the ticket.',
        example: 15.5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateTicketDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The seat identifier.',
        example: 'F12',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "seat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The UUID of the session this ticket is for.',
        example: '0c8c2552-a9b3-483a-b286-4471f9e73b98',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '(Optional) The UUID of the order this ticket belongs to.',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        required: false,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTicketDto.prototype, "orderId", void 0);
//# sourceMappingURL=create-ticket.dto.js.map