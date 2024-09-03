import { Injectable, Logger } from '@nestjs/common';
import { ILoggerAdapter } from './logger.interface';

@Injectable()
export class NestLoggerAdapter implements ILoggerAdapter {
  private readonly logger = new Logger(NestLoggerAdapter.name);

  info(message: string | object) {
    if (typeof message === 'string') {
      this.logger.log(message);
    } else {
      this.logger.log(JSON.stringify(message));
    }
  }

  error(message: string | object, trace?: string) {
    if (typeof message === 'string') {
      this.logger.error(message, trace);
    } else {
      this.logger.error(JSON.stringify(message), trace);
    }
  }

  warn(message: string | object) {
    if (typeof message === 'string') {
      this.logger.warn(message);
    } else {
      this.logger.warn(JSON.stringify(message));
    }
  }

  debug(message: string | object) {
    if (typeof message === 'string') {
      this.logger.debug(message);
    } else {
      this.logger.debug(JSON.stringify(message));
    }
  }

  trace(message: string | object) {
    if (typeof message === 'string') {
      this.logger.verbose(message);
    } else {
      this.logger.verbose(JSON.stringify(message));
    }
  }
}
