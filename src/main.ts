import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-settings';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  ErrorExceptionFilter,
  HttpExceptionFilter,
} from './infrastructure/exception-filters/exception-filter';
import cookieParser from 'cookie-parser'
import { useContainer } from 'class-validator';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);  

  await app.listen(3000);
}
bootstrap();
