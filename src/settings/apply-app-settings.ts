import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorExceptionFilter, HttpExceptionFilter } from '../infrastructure/exception-filters/exception-filter';
import { get } from 'http';
import { createWriteStream } from 'fs';
import cookieParser from 'cookie-parser'
import { TrimPipe } from '../infrastructure/pipes/body-trim-pipe';
import { UserIdentificationMiddleware } from '../infrastructure/middlewares/user-identification-middleware copy';
// import dotenv from 'dotenv';

// dotenv.config();

const APP_PREFIX = '';
const serverUrl = process.env.SERVER_URL;


export const applyAppSettings = (app: INestApplication) => {
  setAppPrefix(app);


  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  setGlobalPipes(app);

  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter()); //order is important!

  app.use(cookieParser());
  
  setSwagger(app);

  
  setSwaggerStatic();
  
};

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX);
};

const setSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
  .setTitle('products example')
  .setDescription('The products API description')
  .setVersion('1.0')
  .addTag('products')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
}

const setGlobalPipes = (app: INestApplication) => {
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorMessage: any = [];
        errors.forEach((e) => {
          const values = Object.values(e.constraints!);
          values.forEach((v) => {
            errorMessage.push({ message: v, field: e.property });
          });
        });
        throw new BadRequestException(errorMessage);
      },
    }),
  );
}

const setSwaggerStatic = () => {
  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {
    // write swagger ui files
    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
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
      },
    );

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    });
  }
}
