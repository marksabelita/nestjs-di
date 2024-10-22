import {
  EmailDecorator,
  PhoneNumberDecorator,
  TrimStringDecorator,
} from 'src/common/decorator/string.decorator';

export class SignInDto {
  @TrimStringDecorator({ required: true })
  email: string;

  @TrimStringDecorator({ required: true })
  password: string;
}

export class SignUpDto {
  @EmailDecorator({ required: true })
  email: string;

  @TrimStringDecorator({ required: true })
  password: string;

  @PhoneNumberDecorator({ required: true })
  phoneNumber: string;
}

export class RefreshTokenDto {
  @TrimStringDecorator({ required: true })
  refreshToken: string;
}

export class MFASetupDto {
  @TrimStringDecorator({ required: true })
  userId: string;
}

export class MFAVerifySetupDto {
  @TrimStringDecorator({ required: true })
  userId: string;

  @TrimStringDecorator({ required: true })
  factorId: string;

  @TrimStringDecorator({ required: true })
  code: string;
}

export class MFAVerifyChallengeDto {
  @TrimStringDecorator({ required: true })
  session: string;

  @TrimStringDecorator({ required: true })
  factorId: string;

  @TrimStringDecorator({ required: true })
  code: string;
}

export class MFAPreferenceDto {
  @TrimStringDecorator({ required: true })
  userId: string;

  @TrimStringDecorator({ required: true })
  enabled: boolean;
}
