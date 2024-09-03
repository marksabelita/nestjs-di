import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
// import { ICatService } from './cat.interface';
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
  // ICatMongoProvider,
  ICatSequalizeProvider,
  ICatService,
  ICatRepository,
} from './cat.interface';
// import {
//   ILocationSequalizeProvider,
//   ILocationService,
// } from '../location/location.interface';
// import { LocationService } from '../location/location.service';
import { LocationModel } from '../location/location.entity';
// import { LocationCreateDto, LocationUpdateDto } from '../location/location.dto';
// import { Model } from 'mongoose';
// import { MongoDBProvider } from 'src/common/database/mongo.provider';
import {
  // getModelToken as mongooseModelToken,
  MongooseModule,
} from '@nestjs/mongoose';
import { CatRepository } from './cat.repository';
import {
  IFileService,
  IStorageService,
} from 'src/common/module/file/file.interface';
import { FileService } from 'src/common/module/file/file.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { LocalStorageService } from 'src/common/module/file/local-storage.service';
import { S3StorageService } from 'src/common/module/file/s3-storage.service';

@Module({
  imports: [
    SequelizeModule.forFeature([CatModel, LocationModel]),
    MongooseModule.forFeature([{ name: CatDocument.name, schema: CatSchema }]),
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
      provide: ICatSequalizeProvider,
      useFactory: (catModel: ModelCtor<CatModel>) =>
        new SequelizeProvider<CatModel, CreateDto, UpdateDto>(catModel),
      inject: [sequelizeModelToken(CatModel)],
    },
    {
      provide: IFileService,
      useClass: FileService,
    },
    {
      provide: IStorageService,
      useFactory: (configService: ConfigService) => ({
        s3: new S3StorageService(
          configService.get('AWS_ACCESS_KEY_ID'),
          configService.get('AWS_SECRET_ACCESS_KEY'),
          configService.get('AWS_REGION'),
          configService.get('S3_BUCKET_NAME'),
        ),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [],
})
export class CatModule {}

// {
//   provide: ILocationSequalizeProvider,
//   useFactory: (locationModel: ModelCtor<LocationModel>) =>
//     new SequelizeProvider<
//       LocationModel,
//       LocationCreateDto,
//       LocationUpdateDto
//     >(locationModel),
//   inject: [sequelizeModelToken(LocationModel)],
// },
// {
//   provide: ICatMongoProvider,
//   useFactory: (model: Model<CatDocument>) =>
//     new MongoDBProvider<CatDocument, CreateDto, UpdateDto>(model),
//   inject: [mongooseModelToken(CatDocument.name)],
// },
