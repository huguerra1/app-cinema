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
exports.CreateOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const snack_combo_order_dto_1 = require("./snack-combo-order.dto");
class CreateOrderDto {
    userId;
    ticketIds;
    snackCombos;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The UUID of the user placing the order.',
        example: '0c8c2552-a9b3-483a-b286-4471f9e73b98',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'An array of ticket UUIDs to be included in the order.',
        example: [
            'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
        ],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "ticketIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'An array of objects, each with a snackComboId and quantity.',
        required: false,
        type: [snack_combo_order_dto_1.SnackComboOrderDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => snack_combo_order_dto_1.SnackComboOrderDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "snackCombos", void 0);
//# sourceMappingURL=create-order.dto.js.map