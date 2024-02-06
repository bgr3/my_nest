import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorExceptionFilter, HttpExceptionFilter } from '../infrastructure/exception-filters/exception-filter';
import { get as getHTTPS} from 'https';
//import { get as getHTTP} from 'http';
import { createWriteStream } from 'fs';
import cookieParser from 'cookie-parser'
// import dotenv from 'dotenv';

// dotenv.config();

const APP_PREFIX = '';
const serverUrl = process.env.SERVER_URL;
const get = getHTTPS //process.env.MY_ENV === 'local' ? getHTTP : getHTTPS;
console.log(process.env.MY_ENV === 'local' ? 'getHTTP' : 'getHTTPS'); 


export const applyAppSettings = (app: INestApplication) => {
  //setAppPrefix(app);


  

  
};

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX);
};

export const setSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
  .setTitle('products example')
  .setDescription('The products API description')
  .setVersion('1.0')
  .addTag('products')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);
}

export const setGlobalPipes = (app: INestApplication) => {
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

export const setSwaggerStatic = () => {
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

// getHTTP
// [32m[Nest] 8  - [39m02/06/2024, 6:28:51 PM [32m    LOG[39m [38;5;3m[NestFactory] [39m[32mStarting Nest application...[39m
// [32m[Nest] 8  - [39m02/06/2024, 6:28:52 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mMongooseModule dependencies initialized[39m[38;5;3m +99ms[39m
// [32m[Nest] 8  - [39m02/06/2024, 6:28:52 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mJwtModule dependencies initialized[39m[38;5;3m +0ms[39m
// [32m[Nest] 8  - [39m02/06/2024, 6:28:52 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mServeStaticModule dependencies initialized[39m[38;5;3m +0ms[39m
// [31m[Nest] 8  - [39m02/06/2024, 6:28:53 PM [31m  ERROR[39m [38;5;3m[MongooseModule] [39m[31mUnable to connect to the database. Retrying (1)...[39m
// [31m[Nest] 8  - [39m02/06/2024, 6:28:56 PM [31m  ERROR[39m [38;5;3m[MongooseModule] [39m[31mUnable to connect to the database. Retrying (2)...[39m
// No exports found in module "/var/task/src/main.js".
// Did you forget to export a function or a server?
// INIT_REPORT Init Duration: 8431.38 ms	Phase: invoke	Status: error	Error Type: Runtime.ExitError
// Error: Runtime exited with error: exit status 1