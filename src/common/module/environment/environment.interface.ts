import { Dialect } from 'sequelize';

export enum EEnvironmentVariables {
  ENV = 'ENV',
  SQL_DB_DIALECT = 'SQL_DB_DIALECT',
  SQL_DB_HOST = 'SQL_DB_HOST',
  SQL_DB_PORT = 'SQL_DB_PORT',
  SQL_DB_SSL = 'SQL_DB_SSL',
  SQL_DB_USERNAME = 'SQL_DB_USERNAME',
  SQL_DB_PASSWORD = 'SQL_DB_PASSWORD',
  SQL_DB_DATA = 'SQL_DB_DATA',
  NOSQL_DB_URI = 'NOSQL_DB_URI',
  NOSQL_DB_NAME = 'NOSQL_DB_NAME',
}

export interface IPostgresConfig {
  dialect: Dialect;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialectOptions: {
    ssl: boolean;
  };
}

export interface IMongoConfig {
  uri: string;
  dbName: string;
}

export interface IEnvironmentService {
  get(key: EEnvironmentVariables): string;
  getNumber(key: EEnvironmentVariables): number;
  getBoolean(key: EEnvironmentVariables): boolean;
  getPostgresConfig(): IPostgresConfig;
  getMongoConfig(): IMongoConfig;
}
export const IEnvironmentService = Symbol('IEnvironmentService');
