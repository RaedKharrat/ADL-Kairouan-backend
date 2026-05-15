"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const multer_1 = require("multer");
const uploads_controller_1 = require("./uploads.controller");
const uploads_service_1 = require("./uploads.service");
const cloudinary_provider_1 = require("./cloudinary.provider");
let UploadsModule = class UploadsModule {
};
exports.UploadsModule = UploadsModule;
exports.UploadsModule = UploadsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: () => ({
                    storage: (0, multer_1.memoryStorage)(),
                    limits: { fileSize: 50 * 1024 * 1024 },
                    fileFilter: (_req, file, cb) => {
                        const allowed = /\.(jpg|jpeg|png|gif|webp|svg|pdf|xlsx|xls|doc|docx|mp4|mov|avi|mp3)$/i;
                        if (!file.originalname.match(allowed)) {
                            return cb(new Error('File type not allowed'), false);
                        }
                        cb(null, true);
                    },
                }),
            }),
        ],
        controllers: [uploads_controller_1.UploadsController],
        providers: [uploads_service_1.UploadsService, cloudinary_provider_1.CloudinaryProvider],
        exports: [uploads_service_1.UploadsService, cloudinary_provider_1.CloudinaryProvider],
    })
], UploadsModule);
//# sourceMappingURL=uploads.module.js.map