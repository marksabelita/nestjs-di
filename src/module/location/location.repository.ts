import { Inject, Injectable } from '@nestjs/common';
import { IDatabaseProvider } from 'src/common/database/database.inteface';
import { BaseRepository } from 'src/common/database/base.repository';
import { ILoggerService } from 'src/common/module/logger/logger.interface';
import { ILocation, ILocationDatabaseProvider } from './location.interface';
import { CreateLocationDto, UpdateLocationDto } from './location.dto';

@Injectable()
export class LocationRepository extends BaseRepository<
  ILocation,
  CreateLocationDto,
  UpdateLocationDto
> {
  constructor(
    @Inject(ILocationDatabaseProvider)
    protected readonly databaseProvider: IDatabaseProvider<
      ILocation,
      CreateLocationDto,
      UpdateLocationDto
    >,
    @Inject(ILoggerService)
    protected readonly loggerService: ILoggerService,
  ) {
    super(databaseProvider, loggerService);
  }
}
