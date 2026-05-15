import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: string, limit = 10) {
    if (!query || query.trim().length < 2) return { projects: [], blogPosts: [], reports: [] };

    const searchTerm = query.trim();
    const ilike = (field: string) => ({ contains: searchTerm, mode: 'insensitive' as const });

    const [projects, blogPosts, reports] = await Promise.all([
      this.prisma.project.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
          OR: [{ title: ilike('title') }, { excerpt: ilike('excerpt') }],
        },
        take: limit,
        select: { id: true, title: true, slug: true, coverImage: true, excerpt: true, category: { select: { name: true } } },
      }),
      this.prisma.blogPost.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
          OR: [{ title: ilike('title') }, { excerpt: ilike('excerpt') }],
        },
        take: limit,
        select: { id: true, title: true, slug: true, coverImage: true, excerpt: true, publishedAt: true, category: { select: { name: true } } },
      }),
      this.prisma.report.findMany({
        where: {
          published: true,
          OR: [{ title: ilike('title') }, { description: ilike('description') }],
        },
        take: limit,
        select: { id: true, title: true, description: true, fileUrl: true, year: true },
      }),
    ]);

    return { projects, blogPosts, reports };
  }
}
