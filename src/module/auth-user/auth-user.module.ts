import { Module } from '@nestjs/common';
import { AuthUserController } from './auth-user.controller';
import { AuthModule } from 'src/common/module/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthUserController],
})
export class AuthUserModule {}
