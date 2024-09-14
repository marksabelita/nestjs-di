import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatDocument, CatModel, CatSchema } from './cat.entity';
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
import { LocationModel } from '../location/location.entity';
import { CatRepository } from './cat.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IDatabaseTransaction } from 'src/common/database/database.inteface';
import { SequelizeTransactionProvider } from 'src/common/database/sequalize-transaction.provider';
import { Sequelize } from 'sequelize-typescript';
import { S3StorageService } from 'src/common/module/file/s3-storage.service';
import { IStorageService } from 'src/common/module/file/file.interface';

@Module({
  imports: [
    SequelizeModule.forFeature([CatModel, LocationModel]),
    // MongooseModule.forFeature([{ name: CatDocument.name, schema: CatSchema }]),
    ConfigModule,
  ],
  controllers: [CatController],
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
    // {
    //   provide: ICatDatabaseProvider,
    //   useFactory: (model: Model<CatDocument>, connection: Connection) =>
    //     new MongoDBProvider<CatDocument, CreateDto, UpdateDto>(
    //       model,
    //       connection,
    //     ),
    //   inject: [mongooseModelToken(CatDocument.name), getConnectionToken()],
    // },
    // {
    //   provide: IDatabaseTransaction,
    //   useClass: DatabaseTransaction,
    // },
    // {
    //   provide: IFileService,
    //   useClass: FileService,
    // },
    {
      provide: IStorageService,
      useFactory: (s3Storage: S3StorageService) => ({
        s3: s3Storage,
      }),
      inject: [S3StorageService],
    },
    S3StorageService,
  ],
  exports: [ICatService],
})
export class CatCoreModule {}
