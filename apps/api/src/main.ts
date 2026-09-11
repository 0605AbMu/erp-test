import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { LightThemeCss } from './swagger/swagger.theme.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Configure ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger configuration
   const config = new DocumentBuilder()
    .setTitle('Test ERP API')
    .setDescription('Test ERP REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    customCss: LightThemeCss,
    swaggerOptions: {persistAuthorization: true},
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
