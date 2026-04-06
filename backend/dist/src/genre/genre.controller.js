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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreController = void 0;
const common_1 = require("@nestjs/common");
const genre_service_1 = require("./genre.service");
const create_genre_dto_1 = require("./dto/create-genre.dto");
const update_genre_dto_1 = require("./dto/update-genre.dto");
const swagger_1 = require("@nestjs/swagger");
let GenreController = class GenreController {
    genreService;
    constructor(genreService) {
        this.genreService = genreService;
    }
    create(createGenreDto) {
        return this.genreService.create(createGenreDto);
    }
    findAll() {
        return this.genreService.findAll();
    }
    findOne(id) {
        return this.genreService.findOne(id);
    }
    update(id, updateGenreDto) {
        return this.genreService.update(id, updateGenreDto);
    }
    remove(id) {
        return this.genreService.remove(id);
    }
};
exports.GenreController = GenreController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new genre' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_genre_dto_1.CreateGenreDto]),
    __metadata("design:returntype", void 0)
], GenreController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all genres' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GenreController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a genre by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GenreController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a genre by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_genre_dto_1.UpdateGenreDto]),
    __metadata("design:returntype", void 0)
], GenreController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a genre by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GenreController.prototype, "remove", null);
exports.GenreController = GenreController = __decorate([
    (0, swagger_1.ApiTags)('genre'),
    (0, common_1.Controller)('genre'),
    __metadata("design:paramtypes", [genre_service_1.GenreService])
], GenreController);
//# sourceMappingURL=genre.controller.js.map