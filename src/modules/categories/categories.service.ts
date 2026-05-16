import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private slug(name: string) {
    return slugify(name, { lower: true, strict: true });
  }

  // ─── Project Categories ───────────────────────────────────────────────────

  findProjectCategories() {
    return this.prisma.projectCategory.findMany({ 
      orderBy: { order: 'asc' },
      include: { _count: { select: { projects: true } } }
    });
  }

  createProjectCategory(data: { name: string; description?: string; order?: number }) {
    return this.prisma.projectCategory.create({ data: { ...data, slug: this.slug(data.name) } });
  }

  async updateProjectCategory(id: string, data: Partial<{ name: string; description: string; order: number }>) {
    const cat = await this.prisma.projectCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Project category not found');
    return this.prisma.projectCategory.update({ where: { id }, data: { ...data, ...(data.name && { slug: this.slug(data.name) }) } });
  }

  async removeProjectCategory(id: string) {
    const cat = await this.prisma.projectCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Project category not found');
    return this.prisma.projectCategory.delete({ where: { id } });
  }

  // ─── Blog Categories ──────────────────────────────────────────────────────

  findBlogCategories() {
    return this.prisma.blogCategory.findMany({ 
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } }
    });
  }

  createBlogCategory(data: { name: string; description?: string }) {
    return this.prisma.blogCategory.create({ data: { name: data.name, description: data.description, slug: this.slug(data.name) } });
  }

  async updateBlogCategory(id: string, data: Partial<{ name: string; description: string }>) {
    const cat = await this.prisma.blogCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Blog category not found');
    return this.prisma.blogCategory.update({ 
      where: { id }, 
      data: { 
        name: data.name, 
        description: data.description, 
        ...(data.name && { slug: this.slug(data.name) }) 
      } 
    });
  }

  async removeBlogCategory(id: string) {
    const cat = await this.prisma.blogCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Blog category not found');
    return this.prisma.blogCategory.delete({ where: { id } });
  }

  // ─── Media Categories ─────────────────────────────────────────────────────

  findMediaCategories() {
    return this.prisma.mediaCategory.findMany({ 
      orderBy: { name: 'asc' },
      include: { _count: { select: { media: true } } }
    });
  }

  createMediaCategory(data: { name: string }) {
    return this.prisma.mediaCategory.create({ data: { name: data.name, slug: this.slug(data.name) } });
  }

  async removeMediaCategory(id: string) {
    return this.prisma.mediaCategory.delete({ where: { id } });
  }

  // ─── Report Categories ────────────────────────────────────────────────────

  findReportCategories() {
    return this.prisma.reportCategory.findMany({ 
      orderBy: { name: 'asc' },
      include: { _count: { select: { reports: true } } }
    });
  }

  createReportCategory(data: { name: string }) {
    return this.prisma.reportCategory.create({ data: { name: data.name, slug: this.slug(data.name) } });
  }

  async removeReportCategory(id: string) {
    return this.prisma.reportCategory.delete({ where: { id } });
  }

  // ─── FAQ Categories ───────────────────────────────────────────────────────

  findFaqCategories() {
    return this.prisma.faqCategory.findMany({ 
      orderBy: { name: 'asc' },
      include: { _count: { select: { faqs: true } } }
    });
  }

  createFaqCategory(data: { name: string }) {
    return this.prisma.faqCategory.create({ data: { name: data.name, slug: this.slug(data.name) } });
  }

  async removeFaqCategory(id: string) {
    return this.prisma.faqCategory.delete({ where: { id } });
  }
}
