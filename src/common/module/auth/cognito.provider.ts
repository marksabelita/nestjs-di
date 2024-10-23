import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AssociateSoftwareTokenCommand,
  VerifySoftwareTokenCommand,
  RespondToAuthChallengeCommand,
  GetUserCommand,
  SetUserMFAPreferenceCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  AuthFlowType,
  ChallengeNameType,
  ConfirmSignUpCommand,
  CodeMismatchException,
  ExpiredCodeException,
  NotAuthorizedException,
  UserNotFoundException,
  ResendConfirmationCodeCommand,
  LimitExceededException,
  TooManyRequestsException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  IAuthProvider,
  IAuthResponse,
  IMFASetupResponse,
  IMFAVerifyResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import {
  EEnvironmentVariables,
  IEnvironmentService,
} from '../environment/environment.interface';
import { createHmac } from 'crypto';
import { ILoggerService } from '../logger/logger.interface';

@Injectable()
export class CognitoAuthProvider implements IAuthProvider {
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    @Inject(IEnvironmentService)
    private readonly envService: IEnvironmentService,
    @Inject(ILoggerService)
    private readonly loggerService: ILoggerService,
  ) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.envService.get(EEnvironmentVariables.AWS_REGION),
      credentials: {
        accessKeyId: this.envService.get(
          EEnvironmentVariables.AWS_ACCESS_KEY_ID,
        ),
        secretAccessKey: this.envService.get(
          EEnvironmentVariables.AWS_SECRET_ACCESS_KEY,
        ),
      },
    });

    this.userPoolId = this.envService.get(
      EEnvironmentVariables.COGNITO_USER_POOL_ID,
    );
    this.clientId = this.envService.get(
      EEnvironmentVariables.COGNITO_CLIENT_ID,
    );
    this.clientSecret = this.envService.get(
      EEnvironmentVariables.COGNITO_CLIENT_SECRET,
    );
  }

  private calculateSecretHash(username: string): string {
    const message = username + this.clientId;
    const hmac = createHmac('sha256', this.clientSecret);
    hmac.update(message);
    return hmac.digest('base64');
  }

  signUp(
    email: string,
    password: string,
    phoneNumber: string,
  ): Observable<IAuthResponse> {
    this.loggerService.log({ email }, 'CognitoAuthProvider.confirmSignUp');

    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      SecretHash: this.calculateSecretHash(email),
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'phone_number',
          Value: phoneNumber,
        },
      ],
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => ({
        userId: result.UserSub,
        status: 'SUCCESS',
        mfaRequired: false,
      })),
      catchError((error) =>
        throwError(() => new UnauthorizedException(error.message)),
      ),
    );
  }

  confirmSignUp(email: string, code: string): Observable<boolean> {
    this.loggerService.log({ email }, 'CognitoAuthProvider.confirmSignUp');
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
      SecretHash: this.calculateSecretHash(email),
    });

    return from(this.cognitoClient.send(command)).pipe(
      map(() => true),
      catchError((error) => {
        if (error instanceof CodeMismatchException) {
          return throwError(() => new Error('Invalid confirmation code'));
        }
        if (error instanceof ExpiredCodeException) {
          return throwError(() => new Error('Confirmation code has expired'));
        }
        if (error instanceof NotAuthorizedException) {
          return throwError(
            () => new Error('Not authorized to perform confirmation'),
          );
        }
        if (error instanceof UserNotFoundException) {
          return throwError(() => new Error('User not found'));
        }
        return throwError(() => new Error('Failed to confirm signup'));
      }),
    );
  }

  resendConfirmationCode(email: string): Observable<boolean> {
    this.loggerService.log(
      { email },
      'CognitoAuthProvider.resendConfirmationCode',
    );

    const command = new ResendConfirmationCodeCommand({
      ClientId: this.clientId,
      Username: email,
      SecretHash: this.calculateSecretHash(email),
    });

    return from(this.cognitoClient.send(command)).pipe(
      map(() => true),
      catchError((error) => {
        if (error instanceof UserNotFoundException) {
          return throwError(() => new Error('User not found'));
        }
        if (error instanceof LimitExceededException) {
          return throwError(
            () => new Error('Attempt limit exceeded, please try again later'),
          );
        }
        if (error instanceof TooManyRequestsException) {
          return throwError(
            () => new Error('Too many requests, please try again later'),
          );
        }
        if (error instanceof NotAuthorizedException) {
          return throwError(() => new Error('Not authorized to resend code'));
        }
        return throwError(
          () => new Error('Failed to resend confirmation code'),
        );
      }),
    );
  }

  signIn(email: string, password: string): Observable<IAuthResponse> {
    this.loggerService.log({ email }, 'CognitoAuthProvider.signIn');

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.calculateSecretHash(email),
      },
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => {
        if (result.AuthenticationResult) {
          return {
            accessToken: result.AuthenticationResult.AccessToken,
            refreshToken: result.AuthenticationResult.RefreshToken,
            status: 'SUCCESS',
            mfaRequired: false,
            expiresIn: result.AuthenticationResult.ExpiresIn,
          };
        }
        return {
          token: result.Session,
          status: result.ChallengeName || 'SUCCESS',
          mfaRequired:
            result.ChallengeName === ChallengeNameType.SOFTWARE_TOKEN_MFA,
          challengeParameters: result.ChallengeParameters,
        };
      }),
      catchError((error) =>
        throwError(() => new UnauthorizedException(error.message)),
      ),
    );
  }

  refreshToken(refreshToken: string): Observable<IRefreshTokenResponse> {
    this.loggerService.log(
      { refreshToken: refreshToken.length },
      'CognitoAuthProvider.signIn',
    );

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => {
        if (!result.AuthenticationResult) {
          throw new UnauthorizedException('Failed to refresh token');
        }
        return {
          accessToken: result.AuthenticationResult.AccessToken,
          refreshToken: result.AuthenticationResult.RefreshToken,
          expiresIn: result.AuthenticationResult.ExpiresIn,
          tokenType: result.AuthenticationResult.TokenType,
        };
      }),
      catchError(() =>
        throwError(() => new UnauthorizedException('Invalid refresh token')),
      ),
    );
  }

  setupMFA(accessToken: string): Observable<IMFASetupResponse> {
    this.loggerService.log(
      { refreshToken: accessToken.length },
      'CognitoAuthProvider.signIn',
    );

    const command = new AssociateSoftwareTokenCommand({
      AccessToken: accessToken,
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => ({
        factorId: 'SOFTWARE_TOKEN_MFA',
        secretCode: result.SecretCode,
        status: 'SUCCESS',
      })),
      catchError((error) =>
        throwError(
          () =>
            new UnauthorizedException('Failed to setup MFA: ' + error.message),
        ),
      ),
    );
  }

  verifyMFASetup(
    accessToken: string,
    factorId: string,
    code: string,
  ): Observable<IMFAVerifyResponse> {
    this.loggerService.log(
      { refreshToken: accessToken.length, code },
      'CognitoAuthProvider.signIn',
    );

    const command = new VerifySoftwareTokenCommand({
      AccessToken: accessToken,
      UserCode: code,
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => ({
        success: result.Status === 'SUCCESS',
        status: result.Status,
      })),
      catchError((error) =>
        throwError(
          () =>
            new UnauthorizedException(
              'Failed to verify MFA setup: ' + error.message,
            ),
        ),
      ),
    );
  }

  verifyMFAChallenge(
    session: string,
    factorId: string,
    code: string,
  ): Observable<IAuthResponse> {
    this.loggerService.log({ session, code }, 'CognitoAuthProvider.signIn');

    const command = new RespondToAuthChallengeCommand({
      ClientId: this.clientId,
      ChallengeName: ChallengeNameType.SOFTWARE_TOKEN_MFA,
      Session: session,
      ChallengeResponses: {
        SOFTWARE_TOKEN_MFA_CODE: code,
      },
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => {
        if (!result.AuthenticationResult) {
          throw new UnauthorizedException('MFA verification failed');
        }
        return {
          accessToken: result.AuthenticationResult.AccessToken,
          refreshToken: result.AuthenticationResult.RefreshToken,
          status: 'SUCCESS',
          mfaRequired: false,
          expiresIn: result.AuthenticationResult.ExpiresIn,
        };
      }),
      catchError((error) =>
        throwError(
          () =>
            new UnauthorizedException('Failed to verify MFA: ' + error.message),
        ),
      ),
    );
  }

  // Admin APIs for managing users
  adminSignIn(email: string): Observable<IAuthResponse> {
    this.loggerService.log({ email }, 'CognitoAuthProvider.signIn');

    const command = new AdminInitiateAuthCommand({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      AuthParameters: {
        USERNAME: email,
      },
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => ({
        token: result.Session,
        status: result.ChallengeName || 'SUCCESS',
        mfaRequired:
          result.ChallengeName === ChallengeNameType.SOFTWARE_TOKEN_MFA,
        challengeParameters: result.ChallengeParameters,
      })),
      catchError((error) =>
        throwError(() => new UnauthorizedException(error.message)),
      ),
    );
  }

  adminRespondToAuthChallenge(
    session: string,
    challengeName: string,
    responses: Record<string, string>,
  ): Observable<IAuthResponse> {
    this.loggerService.log(
      { session, challengeName },
      'CognitoAuthProvider.signIn',
    );

    const command = new AdminRespondToAuthChallengeCommand({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      ChallengeName: challengeName as ChallengeNameType,
      ChallengeResponses: responses,
      Session: session,
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => ({
        accessToken: result.AuthenticationResult?.AccessToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
        status: result.ChallengeName || 'SUCCESS',
        mfaRequired: false,
        expiresIn: result.AuthenticationResult?.ExpiresIn,
      })),
      catchError((error) =>
        throwError(() => new UnauthorizedException(error.message)),
      ),
    );
  }

  getUserMFAPreference(accessToken: string): Observable<{
    enabled: boolean;
    preferred: string | null;
  }> {
    this.loggerService.log(
      { accessToken: accessToken.length },
      'CognitoAuthProvider.signIn',
    );

    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => ({
        enabled:
          result.UserMFASettingList?.includes('SOFTWARE_TOKEN_MFA') ?? false,
        preferred: result.PreferredMfaSetting || null,
      })),
      catchError((error) =>
        throwError(
          () =>
            new UnauthorizedException(
              'Failed to get MFA preferences: ' + error.message,
            ),
        ),
      ),
    );
  }

  setUserMFAPreference(
    accessToken: string,
    enabled: boolean,
  ): Observable<boolean> {
    this.loggerService.log(
      { accessToken: accessToken.length, enabled: true },
      'setUserMFAPreference.signIn',
    );

    const command = new SetUserMFAPreferenceCommand({
      AccessToken: accessToken,
      SoftwareTokenMfaSettings: {
        Enabled: enabled,
        PreferredMfa: enabled,
      },
    });

    return from(this.cognitoClient.send(command)).pipe(
      map(() => enabled),
      catchError((error) =>
        throwError(
          () =>
            new UnauthorizedException(
              'Failed to set MFA preference: ' + error.message,
            ),
        ),
      ),
    );
  }
}
