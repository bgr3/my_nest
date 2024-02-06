import { Injectable } from '@nestjs/common';
// import dotenv from 'dotenv';

// dotenv.config();

@Injectable()
export class AppService {
  getHello(): string {
    return 'My nest app';
  }
}
