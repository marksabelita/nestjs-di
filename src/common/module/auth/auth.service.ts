import { Injectable, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  IAuthProvider,
  IAuthResponse,
  IAuthService,
  IMFASetupResponse,
  IMFAVerifyResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { ILoggerService } from '../logger/logger.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(IAuthProvider)
    private readonly authProvider: IAuthService,
    @Inject(ILoggerService)
    private readonly loggerService: ILoggerService,
  ) {}

  signUp(
    email: string,
    password: string,
    phoneNumber: string,
  ): Observable<IAuthResponse> {
    this.loggerService.log({ email, phoneNumber }, 'AuthService.signUp');
    return this.authProvider.signUp(email, password, phoneNumber);
  }

  confirmSignUp(email: string, code: string): Observable<boolean> {
    this.loggerService.log({ email }, 'AuthService.confirmSignUp');
    return this.authProvider.confirmSignUp(email, code);
  }

  resendConfirmationCode(email: string): Observable<boolean> {
    this.loggerService.log({ email }, 'AuthService.resendConfirmationCode');
    return this.authProvider.resendConfirmationCode(email);
  }

  signIn(email: string, password: string): Observable<IAuthResponse> {
    return this.authProvider.signIn(email, password);
  }

  signOut(accessToken: string): Observable<boolean> {
    return this.authProvider.signOut(accessToken);
  }

  refreshToken(refreshToken: string): Observable<IRefreshTokenResponse> {
    return this.authProvider.refreshToken(refreshToken);
  }

  setupMFA(userId: string): Observable<IMFASetupResponse> {
    return this.authProvider.setupMFA(userId);
  }

  verifyMFASetup(
    userId: string,
    factorId: string,
    code: string,
  ): Observable<IMFAVerifyResponse> {
    return this.authProvider.verifyMFASetup(userId, factorId, code);
  }

  verifyMFAChallenge(
    session: string,
    factorId: string,
    code: string,
  ): Observable<IAuthResponse> {
    return this.authProvider.verifyMFAChallenge(session, factorId, code);
  }

  getMFAPreference(
    userId: string,
  ): Observable<{ enabled: boolean; preferred: string | null }> {
    return this.authProvider.getMFAPreference(userId);
  }

  setMFAPreference(userId: string, enabled: boolean): Observable<boolean> {
    return this.authProvider.setMFAPreference(userId, enabled);
  }
}
