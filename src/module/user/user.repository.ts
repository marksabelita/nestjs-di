import { BaseRepository } from 'src/common/database/base.repository';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { IDatabaseProvider } from 'src/common/database/database.inteface';
import { IUser, IUserSequalizeProvider } from './user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ILoggerService } from 'src/common/module/logger/logger.interface';

@Injectable()
export class UserRepository extends BaseRepository<
  IUser,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @Inject(IUserSequalizeProvider)
    protected readonly databaseProvider: IDatabaseProvider<
      IUser,
      CreateUserDto,
      UpdateUserDto
    >,
    @Inject(ILoggerService)
    protected readonly loggerService: ILoggerService,
  ) {
    super(databaseProvider, loggerService);
  }
}
