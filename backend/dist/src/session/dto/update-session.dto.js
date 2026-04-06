"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_session_dto_1 = require("./create-session.dto");
class UpdateSessionDto extends (0, swagger_1.PartialType)(create_session_dto_1.CreateSessionDto) {
}
exports.UpdateSessionDto = UpdateSessionDto;
//# sourceMappingURL=update-session.dto.js.map