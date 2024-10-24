import { Observable } from 'rxjs';

export interface IAuthResponse {
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  status: string;
  challengeType?: string;
  challengeParameters?: Record<string, any>;
  mfaRequired?: boolean;
  expiresIn?: number;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface IMFASetupResponse {
  factorId: string;
  secretCode?: string;
  qrCodeUrl?: string;
  status: string;
}

export interface IMFAVerifyResponse {
  success: boolean;
  token?: string;
  status: string;
}

export interface IAuthProvider {
  signUp(
    email: string,
    password: string,
    phoneNumber: string,
  ): Observable<IAuthResponse>;
  confirmSignUp(email: string, code: string): Observable<boolean>;
  setupSMSMfa(email: string): Observable<boolean>;
  requestPhoneVerification(email: string): Observable<boolean>;
  signIn(email: string, password: string): Observable<IAuthResponse>;
  setupMFA(email: string): Observable<{ secretCode: string }>;
  getUserMFAPreference(accessToken: string): Observable<{
    enabled: boolean;
    preferred: string | null;
  }>;
  refreshToken(refreshToken: string): Observable<IRefreshTokenResponse>;
}

export const IAuthProvider = Symbol('IAuthProvider');

export interface IAuthService {
  signUp(
    email: string,
    password: string,
    phoneNumber: string,
  ): Observable<IAuthResponse>;
  signIn(email: string, password: string): Observable<IAuthResponse>;
  signOut(accessToken: string): Observable<boolean>;
  refreshToken(refreshToken: string): Observable<IRefreshTokenResponse>;
  confirmSignUp(email: string, code: string): Observable<boolean>;
  resendConfirmationCode(email: string): Observable<boolean>;
  setupMFA(accessToken: string): Observable<boolean>;
  verifyMFASetup(
    userId: string,
    factorId: string,
    code: string,
  ): Observable<IMFAVerifyResponse>;
  verifyMFAChallenge(
    session: string,
    factorId: string,
    code: string,
  ): Observable<IAuthResponse>;
  getMFAPreference(
    userId: string,
  ): Observable<{ enabled: boolean; preferred: string | null }>;
  setMFAPreference(userId: string, enabled: boolean): Observable<boolean>;
}

export const IAuthService = Symbol('IAuthService');
