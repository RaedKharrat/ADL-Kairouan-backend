import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  private slug(name: string) {
    return slugify(name, { lower: true, strict: true });
  }

  findAll() {
    return this.prisma.blogTag.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.blogTag.findUnique({ where: { id }, include: { _count: { select: { posts: true } } } });
  }

  create(data: { name: string }) {
    return this.prisma.blogTag.create({ data: { name: data.name, slug: this.slug(data.name) } });
  }

  async update(id: string, data: { name: string }) {
    const tag = await this.prisma.blogTag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return this.prisma.blogTag.update({ where: { id }, data: { name: data.name, slug: this.slug(data.name) } });
  }

  async remove(id: string) {
    const tag = await this.prisma.blogTag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    return this.prisma.blogTag.delete({ where: { id } });
  }
}
