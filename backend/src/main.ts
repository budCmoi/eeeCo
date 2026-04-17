import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('frontendUrl') ?? 'http://localhost:3000';
  const port = configService.get<number>('port') ?? 4000;

  app.enableCors({
    origin: frontendUrl,
    credentials: true
  });

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  await app.listen(port);
}

void bootstrap();