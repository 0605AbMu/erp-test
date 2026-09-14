import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import 'dotenv/config';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { swaggerResponseFormats } from './swagger/global-response-formats.js';
import { LightThemeCss } from './swagger/swagger.theme.js';
import { ConfigService } from './config/config.service.js';
import type { ValidationError } from 'class-validator';

const validationPropertyNames: Record<string, string> = {
  email: 'Elektron pochta',
  password: 'Parol',
  name: 'Ism',
  surname: 'Familiya',
  size: 'Hajm',
  page: 'Sahifa',
  order: 'Saralash maydoni',
  filters: 'Filtrlar',
};

function translateValidationErrors(errors: ValidationError[]): string {
  return errors.flatMap((error) => {
    const property = validationPropertyNames[error.property] ?? error.property;
    return Object.entries(error.constraints ?? {}).map(([constraint, value]) => {
      switch (constraint) {
        case 'isEmail':
          return `${property} manzili noto‘g‘ri formatda`;
        case 'isString':
          return `${property} matn bo‘lishi kerak`;
        case 'isNumber':
          return `${property} son bo‘lishi kerak`;
        case 'min':
          return `${property} qiymati juda kichik`;
        case 'max':
          return `${property} qiymati juda katta`;
        case 'isNotEmpty':
          return `${property} kiritilishi shart`;
        case 'isOptional':
          return `${property} ixtiyoriy maydon`;
        case 'matches':
          return `${property} formati noto‘g‘ri`;
        case 'whitelistValidation':
          return `${property} maydonidan foydalanish mumkin emas`;
        default:
          return value;
      }
    });
  }).join('; ');
}

export async function createApp() {
  const app = await NestFactory.create(AppModule, {
  });

  const config = app.get(ConfigService);

  app.useLogger(config.NODE_ENV === 'production' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug', 'verbose'])

  //configure proxy headers transformation
  const express = app.getHttpAdapter().getInstance();
  express.set('trust proxy', 1);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (
        !origin ||
        !process.env.VERCEL ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin === 'https://erp-test-web.vercel.app' ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,X-Requested-With',
    credentials: true,
  });

  // Configure ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new BadRequestException(translateValidationErrors(errors)),
    }),
  );
  //Configure global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor())

  //Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  //enable api versioning
  app.enableVersioning();

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Test ERP API')
    .setDescription('Test ERP REST API')
    .setVersion('1.0')
    .addBearerAuth({ description: 'Sarlavhadagi JWT tokeni', type: 'http' })
    .addSecurityRequirements('bearer')
    .addGlobalResponse(...swaggerResponseFormats as any)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, document, {
    customCss: LightThemeCss,
    customSiteTitle: 'Test ERP API Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableShutdownHooks(); //for graceful shutdowns;

  await app.init();
  return app;
}

async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT ?? 3000);
}

if (!process.env.VERCEL) {
  await bootstrap();
}
