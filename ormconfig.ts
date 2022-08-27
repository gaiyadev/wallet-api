import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const liveDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env['DATABASE_LIVE_USER'],
  password: process.env['DATABASE_LIVE_PASSWORD'],
  database: process.env['DATABASE_LIVE_NAME'],
  host: process.env['DATABASE_LIVE_HOST'],
  port: parseInt(process.env['DATABASE_LIVE_HOST']),
  synchronize: true,
  autoLoadEntities: true,
  ssl: false,
  entities: ['dist/src/**/entities/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export const localDatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env['LOCAL_DATABASE_USER'],
  password: process.env['LOCAL_DATABASE_PASSWORD'],
  database: process.env['LOCAL_DATABASE_NAME'],
  host: process.env['LOCAL_DATABASE_HOST'],
  port: parseInt(process.env['LOCAL_DATABASE_PORT']),
  synchronize: true,
  autoLoadEntities: true,
  ssl: false,
  logging: false,
  entities: ['dist/src/**/entities/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
