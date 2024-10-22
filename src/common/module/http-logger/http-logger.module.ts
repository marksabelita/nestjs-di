import { Module } from '@nestjs/common';
import { HttpLoggerService } from './http-logger.service';
import { httpLoggerProvider } from './http.providers';

@Module({
  imports: [],
  providers: [HttpLoggerService, ...httpLoggerProvider],
  exports: [HttpLoggerService],
})
export class HttpLoggerModule {}
