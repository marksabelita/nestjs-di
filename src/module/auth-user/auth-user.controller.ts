import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  IAuthResponse,
  IAuthService,
  IMFAVerifyResponse,
  IRefreshTokenResponse,
} from 'src/common/module/auth/auth.interface';
import {
  ConfirmSignUpDto,
  MFAPreferenceDto,
  MFASetupDto,
  MFAVerifyChallengeDto,
  MFAVerifySetupDto,
  RefreshTokenDto,
  SignInDto,
  SignUpDto,
} from './auth-user.interface';
import { Observable } from 'rxjs';
import { DEFAULT_ROUTES } from 'src/common/defaults/routes.default';
import { ApiTags } from '@nestjs/swagger';
import { DEFAULT_TAGS } from 'src/common/defaults/api-tags.default';

@ApiTags(DEFAULT_TAGS.AUTH)
@Controller(DEFAULT_ROUTES.AUTH)
export class AuthUserController {
  constructor(
    @Inject(IAuthService) private readonly authService: IAuthService,
  ) {}

  @Post(DEFAULT_ROUTES.SIGNUP)
  signUp(@Body() credentials: SignUpDto): Observable<IAuthResponse> {
    return this.authService.signUp(
      credentials.email,
      credentials.password,
      credentials.phoneNumber,
    );
  }

  @Post(DEFAULT_ROUTES.CONFIRM_SIGNUP)
  confirmSignUp(@Body() body: ConfirmSignUpDto): Observable<boolean> {
    return this.authService.confirmSignUp(body.email, body.code);
  }

  @Post(DEFAULT_ROUTES.SIGNIN)
  signIn(@Body() credentials: SignInDto): Observable<IAuthResponse> {
    return this.authService.signIn(credentials.email, credentials.password);
  }

  @Post(DEFAULT_ROUTES.SIGNOUT)
  signOut(@Body() body: { accessToken: string }): Observable<boolean> {
    return this.authService.signOut(body.accessToken);
  }

  @Post(DEFAULT_ROUTES.REFRESH)
  refreshToken(
    @Body() body: RefreshTokenDto,
  ): Observable<IRefreshTokenResponse> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post(DEFAULT_ROUTES.MFA_SETUP)
  setupMFA(@Body() body: MFASetupDto): Observable<boolean> {
    return this.authService.setupMFA(body.email);
  }

  @Post(DEFAULT_ROUTES.MFA_VERIFY_SETUP)
  verifyMFASetup(
    @Body() body: MFAVerifySetupDto,
  ): Observable<IMFAVerifyResponse> {
    return this.authService.verifyMFASetup(
      body.userId,
      body.factorId,
      body.code,
    );
  }

  @Post(DEFAULT_ROUTES.MFA_VERIFY_CHALLENGE)
  verifyMFAChallenge(
    @Body() body: MFAVerifyChallengeDto,
  ): Observable<IAuthResponse> {
    return this.authService.verifyMFAChallenge(
      body.session,
      body.factorId,
      body.code,
    );
  }

  @Post(DEFAULT_ROUTES.MFA_PREFERENCE)
  setMFAPreference(@Body() body: MFAPreferenceDto): Observable<boolean> {
    return this.authService.setMFAPreference(body.userId, body.enabled);
  }

  @Post(DEFAULT_ROUTES.MFA_GET_PREFERENCE)
  getMFAPreference(
    @Body() body: { userId: string },
  ): Observable<{ enabled: boolean; preferred: string | null }> {
    return this.authService.getMFAPreference(body.userId);
  }
}
