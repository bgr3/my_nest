import { INestApplication } from '@nestjs/common';

const APP_PREFIX = '';

export const applyAppSettings = (app: INestApplication) => {
  setAppPrefix(app);
};

const setAppPrefix = (app: INestApplication) => {
  app.setGlobalPrefix(APP_PREFIX);
};
