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
exports.SnackComboOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SnackComboOrderDto {
    snackComboId;
    quantity;
}
exports.SnackComboOrderDto = SnackComboOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The UUID of the snack combo.',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SnackComboOrderDto.prototype, "snackComboId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The quantity of the snack combo.',
        example: 2,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], SnackComboOrderDto.prototype, "quantity", void 0);
//# sourceMappingURL=snack-combo-order.dto.js.map