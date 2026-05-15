import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(entityType: string, entityId: string, data: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
    noIndex?: boolean;
    noFollow?: boolean;
  }) {
    return this.prisma.seoMetadata.upsert({
      where: { entityType_entityId: { entityType, entityId } },
      update: data,
      create: { entityType, entityId, ...data },
    });
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.seoMetadata.findUnique({
      where: { entityType_entityId: { entityType, entityId } },
    });
  }

  async findAll(entityType?: string) {
    return this.prisma.seoMetadata.findMany({
      where: entityType ? { entityType } : {},
      orderBy: { updatedAt: 'desc' },
    });
  }

  async remove(entityType: string, entityId: string) {
    return this.prisma.seoMetadata.deleteMany({
      where: { entityType, entityId },
    });
  }
}
