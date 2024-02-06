import { Injectable } from '@nestjs/common';
// import dotenv from 'dotenv';

// dotenv.config();

@Injectable()
export class AppService {
  getHello(): string {
    return process.env.MY_ENV! //'My nest app';
  }
}
