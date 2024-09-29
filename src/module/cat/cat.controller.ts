import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ICatResponse, ICatService } from './cat.interface';
import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import { DEFAULT_ROUTES } from 'src/common/defaults/routes.default';
import { randomUUID } from 'crypto';
import { ILoggerService } from 'src/common/module/logger/logger.interface';

@Controller(DEFAULT_ROUTES.CATS)
export class CatController {
  constructor(
    @Inject(ILoggerService)
    private readonly loggerService: ILoggerService,
    @Inject(ICatService) private readonly catService: ICatService,
  ) {}

  @Get()
  get(): Observable<ICatResponse[]> {
    return this.catService.findAll({}).pipe(
      switchMap((cats) => {
        // const test = from(axios.get('https://api.example.com/marktest'));

        return forkJoin({
          cats: from([cats]),
          // test: test,
        });
      }),
      map((response) => {
        return response.cats;
      }),
    );
  }

  @Post()
  create(): Observable<ICatResponse> {
    this.loggerService.log({}, 'CatController.create');
    return this.catService.create({ name: randomUUID() });
  }
}
