import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_NEON_URL,
  //database: 'nestORM',
  synchronize: false,
  entities: ['src/**/*orm-entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});
