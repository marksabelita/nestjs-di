import { Controller, Get, Inject, Logger, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomRequest } from './common/interface/http.interface';
import { ILoggerService } from './common/module/logger/logger.interface';
import { randomUUID } from 'crypto';

@Controller()
export class AppController {
  constructor(
    @Inject(ILoggerService) private readonly loggerService: ILoggerService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(@Req() req: CustomRequest): string {
    return this.appService.getHello();
  }

  @Get('/new-routes')
  newRoutes(@Req() req: CustomRequest): string {
    this.loggerService.log('log on controller');
    return this.appService.getHello();
  }

  @Get('/testtest')
  corny(@Req() req: CustomRequest): any {
    return { email: randomUUID() };
  }
}
