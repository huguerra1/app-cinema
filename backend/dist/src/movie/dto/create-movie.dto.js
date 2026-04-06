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
exports.CreateMovieDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMovieDto {
    title;
    durationMinutes;
    synopsis;
    genreId;
}
exports.CreateMovieDto = CreateMovieDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The title of the movie.',
        example: 'The Matrix',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The duration of the movie in minutes.',
        example: 136,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMovieDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A brief synopsis of the movie.',
        example: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "synopsis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The UUID of the genre this movie belongs to.',
        example: '0c8c2552-a9b3-483a-b286-4471f9e73b98',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "genreId", void 0);
//# sourceMappingURL=create-movie.dto.js.map