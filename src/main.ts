import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings, setGlobalPipes, setSwagger, setSwaggerStatic } from './settings/apply-app-settings';
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
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  setGlobalPipes(app);
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter()); //order is important!
  app.use(cookieParser());
  
  setSwagger(app);
  
  

  await app.listen(3000);
  setSwaggerStatic();
}
bootstrap();
