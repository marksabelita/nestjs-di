import { Module } from '@nestjs/common';
import { IAuthProvider, IAuthService } from './auth.interface';
import { CognitoAuthProvider } from './cognito.provider';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  providers: [
    { provide: IAuthService, useClass: AuthService },
    {
      provide: IAuthProvider,
      useClass: CognitoAuthProvider,
    },
  ],
  exports: [IAuthService],
})
export class AuthModule {}
