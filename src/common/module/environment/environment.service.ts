import { ConfigService } from '@nestjs/config';
import {
  EEnvironmentVariables,
  IEnvironmentService,
} from './environment.interface';
import { Injectable } from '@nestjs/common';
import { Dialect } from 'sequelize';

@Injectable()
export class EnvironmentService implements IEnvironmentService {
  constructor(private configService: ConfigService) {}

  get(key: EEnvironmentVariables): string {
    return this.configService.get<string>(key);
  }

  getNumber(key: EEnvironmentVariables): number {
    const value = this.configService.get<string | number>(key);
    if (typeof value === 'number') {
      console.log(value);
      return value;
    }
    if (typeof value === 'string') {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        return parsedValue;
      }
    }

    throw new Error(`Configuration value for ${key} is not a valid number.`);
  }

  getBoolean(key: EEnvironmentVariables): boolean {
    const value = this.configService.get<string>(key);
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }

    false;
  }

  getPostgresConfig() {
    const config = {
      dialect: this.get(EEnvironmentVariables.SQL_DB_DIALECT) as Dialect,
      host: this.get(EEnvironmentVariables.SQL_DB_HOST),
      port: this.getNumber(EEnvironmentVariables.SQL_DB_PORT),
      username: this.get(EEnvironmentVariables.SQL_DB_USERNAME),
      password: this.get(EEnvironmentVariables.SQL_DB_PASSWORD),
      database: this.get(EEnvironmentVariables.SQL_DB_DATA),
      dialectOptions: {
        ssl: this.getBoolean(EEnvironmentVariables.SQL_DB_SSL),
      },
    };

    console.log(config);
    return config;
  }

  getMongoConfig() {
    return {
      uri: this.get(EEnvironmentVariables.NOSQL_DB_URI),
      dbName: this.get(EEnvironmentVariables.NOSQL_DB_NAME),
    };
  }
}
