import { INestApplication } from "@nestjs/common";

const APP_PREFIX = '/hometask_13/api';


export const applyAppSettings = (app: INestApplication) => {
    setAppPrefix(app);
}

const setAppPrefix = (app: INestApplication) => {
    app.setGlobalPrefix(APP_PREFIX)
}