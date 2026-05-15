import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePartnerDto) { return this.prisma.partner.create({ data: dto }); }

  findAll(activeOnly = false) {
    return this.prisma.partner.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const p = await this.prisma.partner.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Partner not found');
    return p;
  }

  async update(id: string, dto: UpdatePartnerDto) {
    await this.findOne(id);
    return this.prisma.partner.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.partner.delete({ where: { id } });
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.prisma.partner.update({ where: { id }, data: { order: index } }),
    );
    return Promise.all(updates);
  }
}
