"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const throttler_2 = require("@nestjs/throttler");
const app_config_1 = require("./config/app.config");
const auth_config_1 = require("./config/auth.config");
const cloudinary_config_1 = require("./config/cloudinary.config");
const database_config_1 = require("./config/database.config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const projects_module_1 = require("./modules/projects/projects.module");
const partners_module_1 = require("./modules/partners/partners.module");
const blog_module_1 = require("./modules/blog/blog.module");
const media_module_1 = require("./modules/media/media.module");
const videos_module_1 = require("./modules/videos/videos.module");
const reports_module_1 = require("./modules/reports/reports.module");
const faq_module_1 = require("./modules/faq/faq.module");
const testimonials_module_1 = require("./modules/testimonials/testimonials.module");
const contact_module_1 = require("./modules/contact/contact.module");
const newsletter_module_1 = require("./modules/newsletter/newsletter.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const settings_module_1 = require("./modules/settings/settings.module");
const seo_module_1 = require("./modules/seo/seo.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const hero_module_1 = require("./modules/hero/hero.module");
const statistics_module_1 = require("./modules/statistics/statistics.module");
const search_module_1 = require("./modules/search/search.module");
const categories_module_1 = require("./modules/categories/categories.module");
const tags_module_1 = require("./modules/tags/tags.module");
const chatbot_module_1 = require("./modules/chatbot/chatbot.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, auth_config_1.default, cloudinary_config_1.default, database_config_1.default],
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
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
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            partners_module_1.PartnersModule,
            blog_module_1.BlogModule,
            media_module_1.MediaModule,
            videos_module_1.VideosModule,
            reports_module_1.ReportsModule,
            faq_module_1.FaqModule,
            testimonials_module_1.TestimonialsModule,
            contact_module_1.ContactModule,
            newsletter_module_1.NewsletterModule,
            uploads_module_1.UploadsModule,
            settings_module_1.SettingsModule,
            seo_module_1.SeoModule,
            dashboard_module_1.DashboardModule,
            hero_module_1.HeroModule,
            statistics_module_1.StatisticsModule,
            search_module_1.SearchModule,
            categories_module_1.CategoriesModule,
            tags_module_1.TagsModule,
            chatbot_module_1.ChatbotModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_2.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map