import { Inject, Injectable } from '@nestjs/common';
import { ICat, ICatDatabaseProvider } from './cat.interface';
import { IDatabaseProvider } from 'src/common/database/database.inteface';
import { CreateDto, UpdateDto } from './dto/create.dto';
import { BaseRepository } from 'src/common/database/base.repository';
import { ILoggerService } from 'src/common/module/logger/logger.interface';

@Injectable()
export class CatRepository extends BaseRepository<ICat, CreateDto, UpdateDto> {
  constructor(
    @Inject(ICatDatabaseProvider)
    protected readonly databaseProvider: IDatabaseProvider<
      ICat,
      CreateDto,
      UpdateDto
    >,
    @Inject(ILoggerService)
    protected readonly loggerService: ILoggerService,
  ) {
    super(databaseProvider, loggerService);
  }
}
