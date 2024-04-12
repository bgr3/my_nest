import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'nodejs',
  password: 'nodejs',
  database: 'nestORM',
  synchronize: false,
  entities: ['src/**/*orm-entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});
