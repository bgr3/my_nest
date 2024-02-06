import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorExceptionFilter, HttpExceptionFilter } from '../infrastructure/exception-filters/exception-filter';
import { get } from 'https';
import { createWriteStream } from 'fs';
import cookieParser from 'cookie-parser'
// import dotenv from 'dotenv';

// dotenv.config();

const APP_PREFIX = '';
const serverUrl = process.env.SERVER_URL;

export const appSettings = (app: INestApplication) => {
  setAppPrefix(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('products example')
    .setDescription('The products API description')
    .setVersion('1.0')
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
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
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter()); //order is important!
  app.use(cookieParser())
  console.log(process.env.NODE_ENV);
  

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
};

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX);
};



// cksAndRejections (node:internal/process/task_queues:95:5) {
//   code: 'ERR_INVALID_PROTOCOL'
// }
// INIT_REPORT Init Duration: 2937.29 ms	Phase: init	Status: error	Error Type: Runtime.ExitError
// mongo URL:  mongodb+srv://bgr:5317138@cluster0.lh1bydb.mongodb.net/api-prd?retryWrites=true&w=majority
// [32m[Nest] 8  - [39m02/06/2024, 4:06:20 PM [32m    LOG[39m [38;5;3m[NestFactory] [39m[32mStarting Nest application...[39m
// [32m[Nest] 8  - [39m02/06/2024, 4:06:20 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mMongooseModule dependencies initialized[39m[38;5;3m +95ms[39m
// [32m[Nest] 8  - [39m02/06/2024, 4:06:20 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mJwtModule dependencies initialized[39m[38;5;3m +1ms[39m
// [32m[Nest] 8  - [39m02/06/2024, 4:06:20 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mServeStaticModule dependencies initialized[39m[38;5;3m +0ms[39m
// [32m[Nest] 8  - [39m02/06/2024, 4:06:21 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mMongooseCoreModule dependencies initialized[39m[38;5;3m +848ms[39m
// [32m[Nest] 8  - [39m02/06/2024, 4:06:21 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mMongooseModule dependencies initialized[39m[38;5;3m +15ms[39m
// [32m[Nest] 8  - [39m02/06/2024, 4:06:21 PM [32m    LOG[39m [38;5;3m[InstanceLoader] [39m[32mAppModule dependencies initialized[39m[38;5;3m +35ms[39m
// development
// Unhandled Promise Rejection 	{"errorType":"Runtime.UnhandledPromiseRejection","errorMessage":"TypeError [ERR_INVALID_PROTOCOL]: Protocol \"https:\" not supported. Expected \"http:\"","reason":{"errorType":"TypeError","errorMessage":"Protocol \"https:\" not supported. Expected \"http:\"","code":"ERR_INVALID_PROTOCOL","stack":["TypeError: Protocol \"https:\" not supported. Expected \"http:\"","    at new NodeError (node:internal/errors:405:5)","    at new ClientRequest (node:_http_client:188:11)","    at request (node:http:100:10)","    at Object.Ie.e.request (/opt/node-bridge/bridge-server-D2QTJ22O.js:1:4124)","    at Ie.e.get (/opt/node-bridge/bridge-server-D2QTJ22O.js:1:4608)","    at appSettings (/vercel/path0/src/settings/apply-app-settings.ts:54:8)","    at bootstrap (/vercel/path0/src/main.ts:19:14)","    at processTicksAndRejections (node:internal/process/task_queues:95:5)"]},"promise":{},"stack":["Runtime.UnhandledPromiseRejection: TypeError [ERR_INVALID_PROTOCOL]: Protocol \"https:\" not supported. Expected \"http:\"","    at process.<anonymous> (file:///var/runtime/index.mjs:1276:17)","    at process.emit (node:events:529:35)","    at process.emit (/var/task/___vc/__launcher/__sourcemap_support.js:602:21)","    at emit (node:internal/process/promises:149:20)","    at processPromiseRejections (node:internal/process/promises:283:27)","    at processTicksAndRejections (node:internal/process/task_queues:96:32)"]}
// Unhandled rejection: TypeError: Protocol "https:" not supported. Expected "http:"
//     at new NodeError (node:internal/errors:405:5)
//     at new ClientRequest (node:_http_client:188:11)
//     at request (node:http:100:10)
//     at Object.Ie.e.request (/opt/node-bridge/bridge-server-D2QTJ22O.js:1:4124)
//     at Ie.e.get (/opt/node-bridge/bridge-server-D2QTJ22O.js:1:4608)
//     at appSettings (/vercel/path0/src/settings/apply-app-settings.ts:54:8)
//     at bootstrap (/vercel/path0/src/main.ts:19:14)
//     at processTicksAndRejections (node:internal/process/task_queues:95:5) {
//   code: 'ERR_INVALID_PROTOCOL'
// }
// INIT_REPORT Init Duration: 4490.14 ms	Phase: invoke	Status: error	Error Type: Runtime.ExitError
// Error: Runtime exited with error: exit status 1
