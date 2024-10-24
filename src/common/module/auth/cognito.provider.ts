import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
  SetUserMFAPreferenceCommand,
  AuthFlowType,
  ChallengeNameType,
  ConfirmSignUpCommand,
  CodeMismatchException,
  ExpiredCodeException,
  NotAuthorizedException,
  UserNotFoundException,
  AdminSetUserMFAPreferenceCommand,
  AssociateSoftwareTokenCommand,
  AdminInitiateAuthCommand,
  LimitExceededException,
  GetUserAttributeVerificationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  IAuthProvider,
  IAuthResponse,
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
    this.loggerService.log({ email }, 'CognitoAuthProvider.signUp');

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
        status: 'SETUP_MFA_REQUIRED', // Changed to indicate MFA setup is needed
        mfaRequired: true, // Always true for new signups
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
        // Check if MFA is not set up
        if (!result.ChallengeName) {
          // Force MFA setup if not already done
          return {
            token: result.Session,
            status: 'SETUP_MFA_REQUIRED',
            mfaRequired: true,
            challengeParameters: result.ChallengeParameters,
          };
        }

        // Normal MFA challenge flow
        if (result.ChallengeName === ChallengeNameType.SOFTWARE_TOKEN_MFA) {
          return {
            token: result.Session,
            status: ChallengeNameType.SOFTWARE_TOKEN_MFA,
            mfaRequired: true,
            challengeParameters: result.ChallengeParameters,
          };
        }

        // Even if authentication is successful, we still require MFA
        if (result.AuthenticationResult) {
          return {
            accessToken: result.AuthenticationResult.AccessToken,
            refreshToken: result.AuthenticationResult.RefreshToken,
            status: 'MFA_REQUIRED',
            mfaRequired: true,
            expiresIn: result.AuthenticationResult.ExpiresIn,
          };
        }

        return {
          token: result.Session,
          status: 'MFA_REQUIRED',
          mfaRequired: true,
          challengeParameters: result.ChallengeParameters,
        };
      }),
      catchError((error) =>
        throwError(() => new UnauthorizedException(error.message)),
      ),
    );
  }

  setupMFA(email: string): Observable<{ secretCode: string }> {
    this.loggerService.log({ email }, 'CognitoAuthProvider.signIn');

    const initiateAuthCommand = new AdminInitiateAuthCommand({
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      AuthParameters: {
        USERNAME: email,
      },
    });

    return from(this.cognitoClient.send(initiateAuthCommand)).pipe(
      switchMap((authResult) => {
        // Now associate the software token
        const associateCommand = new AssociateSoftwareTokenCommand({
          Session: authResult.Session,
        });

        return from(this.cognitoClient.send(associateCommand));
      }),
      map((result) => {
        if (!result.SecretCode) {
          throw new Error('Failed to generate secret code for MFA setup');
        }
        return { secretCode: result.SecretCode };
      }),
      catchError((error) => {
        this.loggerService.error(error, 'Failed to setup MFA');
        return throwError(
          () => new Error(`Failed to enable MFA: ${error.message}`),
        );
      }),
    );
  }

  setupSMSMfa(email: string): Observable<boolean> {
    this.loggerService.log({ email }, 'CognitoDP.setupSMSMfa');

    const command = new AdminSetUserMFAPreferenceCommand({
      UserPoolId: this.userPoolId,
      Username: email,
    });

    return from(this.cognitoClient.send(command)).pipe(
      map(() => true),
      catchError((error) => {
        this.loggerService.error(error, 'Failed to setup SMS MFA');
        return throwError(() => new Error('Failed to enable SMS MFA'));
      }),
    );
  }

  private getAdminToken(email: string): Observable<string> {
    this.loggerService.log({ email }, 'CognitoDP.getAdminToken');

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
      },
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((response) => response.AuthenticationResult.AccessToken),
      catchError((error) => {
        this.loggerService.error(error, 'Failed to get admin token');
        return throwError(() => new Error('Failed to authenticate'));
      }),
    );
  }

  requestPhoneVerification(email: string): Observable<boolean> {
    this.loggerService.log({ email }, 'CognitoDP.requestPhoneVerification');

    return this.getAdminToken(email).pipe(
      switchMap((accessToken) => {
        console.log(accessToken);

        const command = new GetUserAttributeVerificationCodeCommand({
          AccessToken: accessToken,
          AttributeName: 'phone_number',
        });

        return from(this.cognitoClient.send(command));
      }),
      map(() => true),
      catchError((error) => {
        if (error instanceof LimitExceededException) {
          return throwError(
            () => new Error('Too many attempts. Please try again later'),
          );
        }
        return throwError(() => new Error('Failed to send verification code'));
      }),
    );
  }

  getUserMFAPreference(accessToken: string): Observable<{
    enabled: boolean;
    preferred: string | null;
  }> {
    this.loggerService.log(
      { accessToken: accessToken.length },
      'CognitoAuthProvider.getUserMFAPreference',
    );

    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    return from(this.cognitoClient.send(command)).pipe(
      map((result) => {
        const mfaEnabled =
          result.UserMFASettingList?.includes('SOFTWARE_TOKEN_MFA') ?? false;
        if (!mfaEnabled) {
          throw new UnauthorizedException(
            'MFA must be enabled to use this service',
          );
        }
        return {
          enabled: true, // Always return true as MFA is required
          preferred: result.PreferredMfaSetting || 'SOFTWARE_TOKEN_MFA',
        };
      }),
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
    if (!enabled) {
      return throwError(
        () => new UnauthorizedException('MFA cannot be disabled'),
      );
    }

    this.loggerService.log(
      { accessToken: accessToken.length },
      'CognitoAuthProvider.setUserMFAPreference',
    );

    const command = new SetUserMFAPreferenceCommand({
      AccessToken: accessToken,
      SoftwareTokenMfaSettings: {
        Enabled: true, // Always true
        PreferredMfa: true,
      },
    });

    return from(this.cognitoClient.send(command)).pipe(
      map(() => true),
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

  refreshToken(refreshToken: string): Observable<IRefreshTokenResponse> {
    this.loggerService.log(
      { refreshToken: refreshToken.length },
      'CognitoAuthProvider.refreshToken',
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
}
