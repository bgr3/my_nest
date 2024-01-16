import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-settings';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';

const serverUrl = process.env.SERVER_URL

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('products example')
  .setDescription('The products API description')
  .setVersion('1.0')
  .addTag('products')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  applyAppSettings(app);
  await app.listen(3000);

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {

    // write swagger ui files
    get(
      `${serverUrl}/swagger/swagger-ui-bundle.js`, function 
      (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
    });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    });

    get(
  `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
  function (response) {
      response.pipe(
      createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
    );
    });

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    });

  }
}
bootstrap();
