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

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: WinstonModule.createLogger(winstonConfig),
    });

    const configService = app.get(ConfigService);
    
    // On Render/Heroku, the port is provided by the environment variable PORT
    const port = process.env.PORT || configService.get<number>('PORT', 4000);
    const frontendUrl = configService.get<string>('FRONTEND_URL', 'https://adl-kairouan.vercel.app');

    // Security
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );

    // CORS
    app.enableCors({
      origin: [frontendUrl, 'https://adl-kairouan.vercel.app'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
