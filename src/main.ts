import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ErrorInterceptor } from './common/interceptor/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.get(HttpAdapterHost);
  const logger = app.get(Logger);

  app.useGlobalFilters(new ErrorInterceptor(httpAdapter, logger));
  await app.listen(3002);
}
bootstrap();
