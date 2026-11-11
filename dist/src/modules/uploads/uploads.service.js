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
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const path = require("path");
let UploadsService = class UploadsService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
    }
    getMediaType(mimeType) {
        if (mimeType.startsWith('image/'))
            return client_1.MediaType.IMAGE;
        if (mimeType.startsWith('video/'))
            return client_1.MediaType.VIDEO;
        if (mimeType.startsWith('audio/'))
            return client_1.MediaType.AUDIO;
        return client_1.MediaType.DOCUMENT;
    }
    getFolder(type) {
        const base = this.config.get('cloudinary.folder', 'adl-kairouan');
        const subfolders = {
            IMAGE: 'images',
            VIDEO: 'videos',
            DOCUMENT: 'documents',
            AUDIO: 'audio',
        };
        return `${base}/${subfolders[type]}`;
    }
    sanitizeFilename(filename) {
        const basename = path.basename(filename);
        return basename.replace(/[^a-zA-Z0-9._-]/g, '_');
    }
    validateFile(file) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('Fichier invalide ou manquant');
        }
        if (file.mimetype === 'image/svg+xml' || file.originalname.toLowerCase().endsWith('.svg')) {
            const content = file.buffer.toString('utf8').toLowerCase();
            if (content.includes('<script') ||
                content.includes('javascript:') ||
                content.includes('onload=') ||
                content.includes('onerror=') ||
                content.includes('<foreignobject')) {
                throw new common_1.BadRequestException('Le fichier SVG contient du code potentiellement dangereux.');
            }
        }
    }
    async uploadFile(file, categoryId) {
        this.validateFile(file);
        const mediaType = this.getMediaType(file.mimetype);
        const folder = this.getFolder(mediaType);
        const resourceType = mediaType === client_1.MediaType.VIDEO ? 'video' : mediaType === client_1.MediaType.DOCUMENT ? 'raw' : 'image';
        const safeFilename = this.sanitizeFilename(file.originalname);
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
                .upload_stream({
                folder,
                resource_type: resourceType,
                use_filename: true,
                unique_filename: true,
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            })
                .end(file.buffer);
        }).then(async (result) => {
            await this.prisma.mediaItem.create({
                data: {
                    url: result.secure_url,
                    publicId: result.public_id,
                    type: mediaType,
                    filename: safeFilename,
                    mimeType: file.mimetype,
                    size: file.size,
                    width: result.width,
                    height: result.height,
                    ...(categoryId && { categoryId }),
                },
            });
            return result;
        });
    }
    async uploadMultiple(files, categoryId) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        return Promise.all(files.map((f) => this.uploadFile(f, categoryId)));
    }
    async deleteFile(publicId) {
        if (!publicId || publicId.includes('..') || publicId.includes('/') === false && publicId.length < 3) {
            throw new common_1.BadRequestException('Identifiant de fichier invalide');
        }
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        await this.prisma.mediaItem.deleteMany({ where: { publicId } });
        return result;
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map