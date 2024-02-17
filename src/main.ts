import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-settings';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);  

  await app.listen(port);
}
bootstrap();
