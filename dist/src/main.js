"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const nest_winston_1 = require("nest-winston");
const app_module_1 = require("./app.module");
const winston_config_1 = require("./config/winston.config");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: nest_winston_1.WinstonModule.createLogger(winston_config_1.winstonConfig),
        });
        const configService = app.get(config_1.ConfigService);
        const port = process.env.PORT || configService.get('PORT', 4000);
        const frontendUrl = configService.get('FRONTEND_URL', 'https://adl-kairouan.vercel.app');
        app.use((0, helmet_1.default)({
            crossOriginResourcePolicy: { policy: 'cross-origin' },
        }));
        app.enableCors({
            origin: [frontendUrl, 'https://adl-kairouan.vercel.app'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        });
        app.setGlobalPrefix('api');
        app.enableVersioning({
            type: common_1.VersioningType.URI,
            defaultVersion: '1',
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }));
        app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
        app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor(), new logging_interceptor_1.LoggingInterceptor());
        if (configService.get('NODE_ENV') !== 'production') {
            const config = new swagger_1.DocumentBuilder()
                .setTitle('ADL Kairouan Platform API')
                .setDescription('Enterprise Institutional Platform REST API')
                .setVersion('1.0')
                .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
                .addTag('auth', 'Authentication endpoints')
                .addTag('users', 'User management')
                .addTag('projects', 'Projects management')
                .addTag('blog', 'Blog & publications')
                .addTag('media', 'Media library')
                .addTag('reports', 'Reports & transparency')
                .addTag('partners', 'Partners')
                .addTag('faq', 'FAQ management')
                .addTag('testimonials', 'Testimonials')
                .addTag('contact', 'Contact messages')
                .addTag('newsletter', 'Newsletter subscribers')
                .addTag('uploads', 'File uploads')
                .addTag('settings', 'Site settings')
                .addTag('seo', 'SEO metadata')
                .addTag('dashboard', 'Dashboard analytics')
                .build();
            const document = swagger_1.SwaggerModule.createDocument(app, config);
            swagger_1.SwaggerModule.setup('api/docs', app, document, {
                swaggerOptions: {
                    persistAuthorization: true,
                    docExpansion: 'none',
                },
            });
        }
        app.set('trust proxy', 1);
        await app.listen(port, '0.0.0.0');
        console.log(`🚀 API is listening on port ${port}`);
        console.log(`📡 URL: http://0.0.0.0:${port}/api/v1`);
    }
    catch (error) {
        console.error('❌ Critical error during bootstrap:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map