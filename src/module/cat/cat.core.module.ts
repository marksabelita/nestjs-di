import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatModel } from './cat.entity';
import {
  getModelToken as sequelizeModelToken,
  SequelizeModule,
} from '@nestjs/sequelize';
import { SequelizeProvider } from 'src/common/database/sequalize.provider';
import { CreateDto, UpdateDto } from './dto/create.dto';
import { ModelCtor } from 'sequelize-typescript';
import {
  ICatService,
  ICatRepository,
  ICatDatabaseProvider,
} from './cat.interface';
import { CatRepository } from './cat.repository';
import { ConfigModule } from '@nestjs/config';
import { IDatabaseTransaction } from 'src/common/database/database.inteface';
import { SequelizeTransactionProvider } from 'src/common/database/sequalize-transaction.provider';
import { Sequelize } from 'sequelize-typescript';
import { LoggerModule } from 'src/common/module/logger/logger.module';

import { ILoggerService } from 'src/common/module/logger/logger.interface';
import { LoggerService } from 'src/common/module/logger/logger.service';
// import { S3StorageService } from 'src/common/module/file/s3-storage.service';
// import { IStorageService } from 'src/common/module/file/file.interface';
// CatDocument, CatSchema

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: CatDocument.name, schema: CatSchema }]),
    SequelizeModule.forFeature([CatModel]),
    ConfigModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: ICatService,
      useClass: CatService,
    },
    {
      provide: ICatRepository,
      useClass: CatRepository,
    },
    {
      provide: IDatabaseTransaction,
      useFactory: (sequalize: Sequelize) => {
        return new SequelizeTransactionProvider(sequalize);
      },
      inject: [Sequelize],
    },
    {
      provide: ICatDatabaseProvider,
      useFactory: (catModel: ModelCtor<CatModel>) =>
        new SequelizeProvider<CatModel, CreateDto, UpdateDto>(catModel),
      inject: [sequelizeModelToken(CatModel)],
    },
    {
      provide: ILoggerService,
      useClass: LoggerService,
    },
  ],
  exports: [ICatService, ILoggerService],
})
export class CatCoreModule {}
