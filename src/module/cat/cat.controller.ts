import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ICatResponse, ICatService } from './cat.interface';
import { Observable } from 'rxjs';
import { DEFAULT_ROUTES } from 'src/common/defaults/routes.default';
import { randomUUID } from 'crypto';

@Controller(DEFAULT_ROUTES.CATS)
export class CatController {
  constructor(@Inject(ICatService) private readonly catService: ICatService) {}

  @Get()
  get(): Observable<ICatResponse[]> {
    return this.catService.findAll({});
  }

  @Post()
  create(): Observable<ICatResponse> {
    const service = this.catService;
    return service.create({ name: randomUUID() });
  }
}
