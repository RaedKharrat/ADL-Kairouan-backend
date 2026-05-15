import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// Config
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import cloudinaryConfig from './config/cloudinary.config';
import databaseConfig from './config/database.config';

// Core Modules
import { PrismaModule } from './prisma/prisma.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PartnersModule } from './modules/partners/partners.module';
import { BlogModule } from './modules/blog/blog.module';
import { MediaModule } from './modules/media/media.module';
import { VideosModule } from './modules/videos/videos.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FaqModule } from './modules/faq/faq.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { ContactModule } from './modules/contact/contact.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SeoModule } from './modules/seo/seo.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HeroModule } from './modules/hero/hero.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SearchModule } from './modules/search/search.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, cloudinaryConfig, databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: 1000,
            limit: 10,
          },
          {
            name: 'medium',
            ttl: 10000,
            limit: 50,
          },
          {
            name: 'long',
            ttl: 60000,
            limit: 200,
          },
        ],
      }),
    }),

    // Core
    PrismaModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    PartnersModule,
    BlogModule,
    MediaModule,
    VideosModule,
    ReportsModule,
    FaqModule,
    TestimonialsModule,
    ContactModule,
    NewsletterModule,
    UploadsModule,
    SettingsModule,
    SeoModule,
    DashboardModule,
    HeroModule,
    StatisticsModule,
    SearchModule,
    CategoriesModule,
    TagsModule,
    ChatbotModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
