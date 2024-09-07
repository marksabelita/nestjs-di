import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CatModel } from 'src/module/cat/cat.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { IDatabaseTransaction } from './database.inteface';
// import { Sequelize } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeTransactionProvider } from './sequalize-transaction.provider';
import { IUserSequalizeProvider } from 'src/module/user/user.interface';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        dialectOptions: {
          ssl: false,
        },
        host: 'localhost',
        port: 5432,
        username: 'citizix_user',
        password: 'S3cret',
        database: 'citizix_db',
        models: [CatModel],
      }),
      inject: [],
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: '',
        dbName: 'project',
      }),
      inject: [],
    }),
  ],
  providers: [
    // {
    //   provide: IDatabaseTransaction,
    //   useFactory: (sequalize: Sequelize) => {
    //     return new SequelizeTransactionProvider(sequalize);
    //   },
    //   inject: [Sequelize],
    // },
  ],
  exports: [],
})
export class DatabaseModule {}
