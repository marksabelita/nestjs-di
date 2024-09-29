import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DEFAULT_ROUTES } from 'src/common/defaults/routes.default';
import { CatModule } from 'src/module/cat/cat.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { EnvironmentModule } from 'src/common/module/environment/environment.module';

describe('CatController (e2e)', () => {
  let app: INestApplication;
  const route = DEFAULT_ROUTES.CATS;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CatModule, DatabaseModule, EnvironmentModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it(`Cat (GET)`, () => {
    request(app.getHttpServer()).get(route).expect(200);
  });
});
