import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  IAuthResponse,
  IAuthService,
  IMFASetupResponse,
  IMFAVerifyResponse,
  IRefreshTokenResponse,
} from 'src/common/module/auth/auth.interface';
import {
  MFAPreferenceDto,
  MFASetupDto,
  MFAVerifyChallengeDto,
  MFAVerifySetupDto,
  RefreshTokenDto,
  SignInDto,
  SignUpDto,
} from './auth-user.interface';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthUserController {
  constructor(
    @Inject(IAuthService) private readonly authService: IAuthService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() credentials: SignUpDto): Observable<IAuthResponse> {
    console.log(credentials);

    return this.authService.signUp(
      credentials.email,
      credentials.password,
      credentials.phoneNumber,
    );
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() credentials: SignInDto): Observable<IAuthResponse> {
    return this.authService.signIn(credentials.email, credentials.password);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signOut(@Body() body: { accessToken: string }): Observable<boolean> {
    return this.authService.signOut(body.accessToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @Body() body: RefreshTokenDto,
  ): Observable<IRefreshTokenResponse> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('mfa/setup')
  @HttpCode(HttpStatus.OK)
  setupMFA(@Body() body: MFASetupDto): Observable<IMFASetupResponse> {
    return this.authService.setupMFA(body.userId);
  }

  @Post('mfa/verify-setup')
  @HttpCode(HttpStatus.OK)
  verifyMFASetup(
    @Body() body: MFAVerifySetupDto,
  ): Observable<IMFAVerifyResponse> {
    return this.authService.verifyMFASetup(
      body.userId,
      body.factorId,
      body.code,
    );
  }

  @Post('mfa/verify-challenge')
  @HttpCode(HttpStatus.OK)
  verifyMFAChallenge(
    @Body() body: MFAVerifyChallengeDto,
  ): Observable<IAuthResponse> {
    return this.authService.verifyMFAChallenge(
      body.session,
      body.factorId,
      body.code,
    );
  }

  @Post('mfa/preference')
  @HttpCode(HttpStatus.OK)
  setMFAPreference(@Body() body: MFAPreferenceDto): Observable<boolean> {
    return this.authService.setMFAPreference(body.userId, body.enabled);
  }

  @Post('mfa/get-preference')
  @HttpCode(HttpStatus.OK)
  getMFAPreference(
    @Body() body: { userId: string },
  ): Observable<{ enabled: boolean; preferred: string | null }> {
    return this.authService.getMFAPreference(body.userId);
  }
}
