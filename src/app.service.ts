import { Injectable } from '@nestjs/common';
import dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppService {
  getHello(): string {
    return process.env.NODE_ENV! //'My nest app';
  }
}
