export interface ILoggerService {
  log(message: string | object, context?: string): void;
  error(message: string | object, trace?: string, context?: string): void;
  warn(message: string | object, context?: string): void;
  debug(message: string | object, context?: string): void;
  verbose(message: string | object, context?: string): void;
}

export interface ILoggerAdapter {
  info(obj: object): void;
  error(obj: object, trace?: string): void;
  warn(obj: object): void;
  debug(obj: object): void;
  trace(obj: object): void;
}

export const ILoggerService = Symbol('ILoggerService');
export const ILoggerAdapter = Symbol('ILoggerAdapter');
