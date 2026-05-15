import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PublishStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      totalProjects, publishedProjects,
      totalBlogPosts, publishedBlogPosts,
      totalPartners,
      totalMediaItems,
      totalReports,
      totalFaqs,
      totalTestimonials,
      unreadMessages, totalMessages,
      totalSubscribers, activeSubscribers,
    ] = await Promise.all([
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { status: PublishStatus.PUBLISHED, deletedAt: null } }),
      this.prisma.blogPost.count({ where: { deletedAt: null } }),
      this.prisma.blogPost.count({ where: { status: PublishStatus.PUBLISHED, deletedAt: null } }),
      this.prisma.partner.count({ where: { isActive: true } }),
      this.prisma.mediaItem.count(),
      this.prisma.report.count({ where: { published: true } }),
      this.prisma.fAQ.count({ where: { isActive: true } }),
      this.prisma.testimonial.count({ where: { isActive: true } }),
      this.prisma.contactMessage.count({ where: { isRead: false, isArchived: false } }),
      this.prisma.contactMessage.count({ where: { isArchived: false } }),
      this.prisma.newsletterSubscriber.count(),
      this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);

    return {
      projects: { total: totalProjects, published: publishedProjects, draft: totalProjects - publishedProjects },
      blog: { total: totalBlogPosts, published: publishedBlogPosts, draft: totalBlogPosts - publishedBlogPosts },
      partners: totalPartners,
      media: totalMediaItems,
      reports: totalReports,
      faqs: totalFaqs,
      testimonials: totalTestimonials,
      messages: { total: totalMessages, unread: unreadMessages },
      newsletter: { total: totalSubscribers, active: activeSubscribers },
    };
  }

  async getRecentActivity(limit = 20) {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
    });
  }

  async getRecentMessages(limit = 5) {
    return this.prisma.contactMessage.findMany({
      where: { isArchived: false },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTopProjects(limit = 5) {
    return this.prisma.project.findMany({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
      orderBy: { views: 'desc' },
      take: limit,
      select: { id: true, title: true, slug: true, views: true, coverImage: true },
    });
  }

  async getTopBlogPosts(limit = 5) {
    return this.prisma.blogPost.findMany({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
      orderBy: { views: 'desc' },
      take: limit,
      select: { id: true, title: true, slug: true, views: true, coverImage: true, publishedAt: true },
    });
  }

  async getMonthlyStats() {
    // Returns last 12 months of content creation
    const months: { year: number; month: number; label: string }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString('default', { month: 'short', year: '2-digit' }) });
    }
    return months;
  }
}
