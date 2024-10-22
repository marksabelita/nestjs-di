import { Inject, Injectable } from '@nestjs/common';
import { ILoggerService } from './common/module/logger/logger.interface';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}
