"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogPostDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_blog_post_dto_1 = require("./create-blog-post.dto");
class UpdateBlogPostDto extends (0, swagger_1.PartialType)(create_blog_post_dto_1.CreateBlogPostDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateBlogPostDto = UpdateBlogPostDto;
//# sourceMappingURL=update-blog-post.dto.js.map