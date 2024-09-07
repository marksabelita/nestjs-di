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
import { ConfigModule } from '@nestjs/config';
import { IDatabaseTransaction } from 'src/common/database/database.inteface';
import { SequelizeTransactionProvider } from 'src/common/database/sequalize-transaction.provider';
import { Sequelize } from 'sequelize-typescript';

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
    // {
    //   provide: IStorageService,
    //   useFactory: (configService: ConfigService) => ({
    //     s3: new S3StorageService(
    //       configService.get('AWS_ACCESS_KEY_ID'),
    //       configService.get('AWS_SECRET_ACCESS_KEY'),
    //       configService.get('AWS_REGION'),
    //       configService.get('S3_BUCKET_NAME'),
    //     ),
    //   }),
    //   inject: [ConfigService],
    // },
  ],
  exports: [],
})
export class CatModule {}
