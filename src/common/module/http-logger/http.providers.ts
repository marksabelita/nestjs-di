import { HttpLogger } from './http-logger.entity';

export const httpLoggerProvider = [
  {
    provide: 'HTTP_LOGGER_REPOSITORY',
    useValue: HttpLogger,
  },
];
