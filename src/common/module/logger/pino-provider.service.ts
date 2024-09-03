import { Injectable } from '@nestjs/common';
import { ILoggerAdapter } from './logger.interface';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PinoLoggerAdapter implements ILoggerAdapter {
  constructor(@InjectPinoLogger() private readonly pinoLogger: PinoLogger) {}

  info(obj: object) {
    this.pinoLogger.info(obj);
  }
  error(obj: object, trace?: string) {
    this.pinoLogger.error(obj, trace);
  }
  warn(obj: object) {
    this.pinoLogger.warn(obj);
  }
  debug(obj: object) {
    this.pinoLogger.debug(obj);
  }
  trace(obj: object) {
    this.pinoLogger.trace(obj);
  }
}
