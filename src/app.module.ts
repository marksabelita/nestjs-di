import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './module/cat/cat.module';
import { HttpContextMiddleware } from './common/middleware/http-context.middleware';
import { DatabaseModule } from './common/database/database.module';
import { LoggerModule } from './common/module/logger/logger.module';
import { AuthUserModule } from './module/auth-user/auth-user.module';

@Module({
  imports: [CatModule, DatabaseModule, LoggerModule, AuthUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpContextMiddleware).forRoutes('*');
  }
}
