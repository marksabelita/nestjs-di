import { Inject, Injectable } from '@nestjs/common';
import { ILoggerService } from './common/module/logger/logger.interface';

@Injectable()
export class AppService {
  constructor(
    @Inject(ILoggerService) private readonly loggerService: ILoggerService,
  ) {}

  getHello(): string {
    this.loggerService.log('this is on app service');
    return 'Hello World!';
  }
}
