import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonConfig } from './config/winston.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { cookieParserMiddleware } from './common/middleware/cookie-parser.middleware';
import * as express from 'express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: WinstonModule.createLogger(winstonConfig),
    });

    const configService = app.get(ConfigService);
    const isProduction = configService.get<string>('NODE_ENV') === 'production';

    // On Render/Heroku, the port is provided by the environment variable PORT
    const port = process.env.PORT || configService.get<number>('PORT', 4000);
    const frontendUrl = configService.get<string>('FRONTEND_URL', 'https://adltunisie.org');

    // Enable graceful shutdown hooks (SIGINT, SIGTERM)
    app.enableShutdownHooks();

    // Cookie Parser Middleware
    app.use(cookieParserMiddleware);

    // Limit JSON and URL-encoded body payload size
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Security Headers via Helmet
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        dnsPrefetchControl: { allow: false },
        frameguard: { action: 'sameorigin' },
        hidePoweredBy: true,
        hsts: isProduction
          ? { maxAge: 31536000, includeSubDomains: true, preload: true }
          : false,
        noSniff: true,
      }),
    );

    // CORS configuration
    const allowedOrigins = [
      frontendUrl,
      'https://adltunisie.org',
      'https://www.adltunisie.org',
      'https://adl-kairouan.vercel.app',
    ].filter(Boolean);
    if (!isProduction) {
      allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
    }

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    });

    // Global prefix
    app.setGlobalPrefix('api');

    // API Versioning
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // Global Validation Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    // Global Filters
    app.useGlobalFilters(new AllExceptionsFilter());

    // Global Interceptors
    app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());

    // Swagger Documentation
    if (configService.get('NODE_ENV') !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('ADL Kairouan Platform API')
        .setDescription('Enterprise Institutional Platform REST API')
        .setVersion('1.0')
        .addBearerAuth(
          { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          'JWT-auth',
        )
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('projects', 'Projects management')
        .addTag('blog', 'Blog & publications')
        .addTag('media', 'Media library')
        .addTag('reports', 'Reports & transparency')
        .addTag('partners', 'Partners')
        .addTag('team', 'Team & Executive Board')
        .addTag('faq', 'FAQ management')
        .addTag('testimonials', 'Testimonials')
        .addTag('contact', 'Contact messages')
        .addTag('newsletter', 'Newsletter subscribers')
        .addTag('uploads', 'File uploads')
        .addTag('settings', 'Site settings')
        .addTag('seo', 'SEO metadata')
        .addTag('dashboard', 'Dashboard analytics')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
          persistAuthorization: true,
          docExpansion: 'none',
        },
      });
    }

    // Trust proxy (for Render/Railway behind reverse proxy)
    app.set('trust proxy', 1);

    await app.listen(port, '0.0.0.0');
    console.log(`🚀 API is listening on port ${port}`);
    console.log(`📡 URL: http://0.0.0.0:${port}/api/v1`);
  } catch (error) {
    console.error('❌ Critical error during bootstrap:', error);
    process.exit(1);
  }
}

bootstrap();
