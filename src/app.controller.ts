import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomRequest } from './common/interface/http.interface';
import { randomUUID } from 'crypto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: CustomRequest): string {
    return this.appService.getHello();
  }

  @Get('/new-routes')
  newRoutes(@Req() req: CustomRequest): string {
    return this.appService.getHello();
  }

  @Get('/testtest')
  corny(@Req() req: CustomRequest): any {
    return { email: randomUUID() };
  }
}
