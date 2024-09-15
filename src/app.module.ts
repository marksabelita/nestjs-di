import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './module/cat/cat.module';
import { HttpContextMiddleware } from './common/middleware/http-context.middleware';
import { LoggerModule } from './common/module/logger/logger.module';
import { DatabaseModule } from './common/database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './common/interceptor/error.interceptor';
import {
  ILoggerAdapter,
  ILoggerService,
} from './common/module/logger/logger.interface';
import { LoggerService } from './common/module/logger/logger.service';
import { IHttpContextService } from './common/module/context/http-context.interface';
import { HttpContextService } from './common/module/context/http-context.service';
import { PinoLoggerAdapter } from './common/module/logger/pino-provider.service';

@Module({
  imports: [CatModule, LoggerModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpContextMiddleware).forRoutes('*');
  }
}
