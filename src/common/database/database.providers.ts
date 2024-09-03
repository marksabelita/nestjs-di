// src/database/database.providers.ts
import { Sequelize } from 'sequelize-typescript';
import { HttpLogger } from '../module/http-logger/http-logger.entity';
import { CatModel } from 'src/module/cat/cat.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'citizix_user',
        password: 'S3cret',
        database: 'citizix_db',
      });
      sequelize.addModels([HttpLogger, CatModel]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
