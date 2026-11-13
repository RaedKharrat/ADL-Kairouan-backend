import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamPaginationDto } from './dto/team-pagination.dto';
import { ReorderItemDto } from '../../common/dto/reorder.dto';
import { paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class TeamService {
  private readonly CACHE_KEY_PUBLIC = 'team:public:all';

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private async invalidateCache() {
    await this.cache.delByPrefix('team:public');
  }

  async create(dto: CreateTeamMemberDto) {
    // If order is not specified, place it at the end
    let order = dto.order;
    if (order === undefined || order === null) {
      const highest = await this.prisma.teamMember.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (highest?.order ?? -1) + 1;
    }

    const member = await this.prisma.teamMember.create({
      data: {
        ...dto,
        order,
      },
    });

    await this.invalidateCache();
    return member;
  }

  async findAll(query: TeamPaginationDto) {
    const { page = 1, limit = 20, search, isActive, sortBy = 'order', sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { role: { contains: search, mode: 'insensitive' as const } },
          { department: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.teamMember.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ [sortBy]: sortOrder }, { createdAt: 'asc' }],
      }),
      this.prisma.teamMember.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findActive() {
    return this.cache.wrap(
      this.CACHE_KEY_PUBLIC,
      async () => {
        return this.prisma.teamMember.findMany({
          where: { isActive: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        });
      },
      600, // 10 minutes cache
    );
  }

  async findOne(id: string) {
    const member = await this.prisma.teamMember.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Membre de l’équipe introuvable');
    return member;
  }

  async update(id: string, dto: UpdateTeamMemberDto) {
    await this.findOne(id);
    const updated = await this.prisma.teamMember.update({
      where: { id },
      data: dto,
    });

    await this.invalidateCache();
    return updated;
  }

  async toggleActive(id: string) {
    const member = await this.findOne(id);
    const updated = await this.prisma.teamMember.update({
      where: { id },
      data: { isActive: !member.isActive },
    });

    await this.invalidateCache();
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.prisma.teamMember.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  async reorder(items: ReorderItemDto[]) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.teamMember.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    await this.invalidateCache();
    return { success: true, count: items.length };
  }
}

