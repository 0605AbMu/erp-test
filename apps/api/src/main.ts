import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { swaggerResponseFormats } from './swagger/global-response-formats.js';
import { LightThemeCss } from './swagger/swagger.theme.js';

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
  //Configure global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor())

  //Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  //enable api versioning
  app.enableVersioning();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Test ERP API')
    .setDescription('Test ERP REST API')
    .setVersion('1.0')
    .addBearerAuth({ description: 'JWT token from header', type: 'http' })
    .addSecurityRequirements('bearer')
    .addGlobalResponse(...swaggerResponseFormats as any)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    customCss: LightThemeCss,
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
