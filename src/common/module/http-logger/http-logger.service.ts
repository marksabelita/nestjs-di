import { Inject, Injectable } from '@nestjs/common';
import { HttpLogger } from './http-logger.entity';

@Injectable()
export class HttpLoggerService {
  constructor(
    @Inject('HTTP_LOGGER_REPOSITORY')
    private httpLoggerRepository: typeof HttpLogger,
  ) {}

  async create(logData: Partial<HttpLogger>): Promise<HttpLogger> {
    return this.httpLoggerRepository.create(logData);
  }
}
