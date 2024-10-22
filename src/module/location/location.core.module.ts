import { Module } from '@nestjs/common';
import {
  SequelizeModule,
  getModelToken as sequelizeModelToken,
} from '@nestjs/sequelize';
import { LocationModel } from './location.entity';
import { ConfigModule } from '@nestjs/config';
import {
  ILocationDatabaseProvider,
  ILocationRepository,
  ILocationService,
} from './location.interface';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';
import { ModelCtor } from 'sequelize-typescript';
import { SequelizeProvider } from 'src/common/database/sequalize.provider';
import { CreateLocationDto, UpdateLocationDto } from './location.dto';

@Module({
  imports: [SequelizeModule.forFeature([LocationModel]), ConfigModule],
  providers: [
    {
      provide: ILocationService,
      useClass: LocationService,
    },
    {
      provide: ILocationRepository,
      useClass: LocationRepository,
    },
    {
      provide: ILocationDatabaseProvider,
      useFactory: (locationModel: ModelCtor<LocationModel>) =>
        new SequelizeProvider<
          LocationModel,
          CreateLocationDto,
          UpdateLocationDto
        >(locationModel),
      inject: [sequelizeModelToken(LocationModel)],
    },
  ],
  exports: [ILocationService],
})
export class LocationCoreModule {}
