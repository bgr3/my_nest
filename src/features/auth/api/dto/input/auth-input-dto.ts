export class AuthPutType {
  constructor(
    public issuedAt: Date,
    public expiredAt: Date,
    public tokens: {
      accessToken: string;
      refreshToken: string;
    },
  ) {}
}

export class AuthLoginInputDTO {
  constructor(
    public loginOrEmail: string,
    public password: string,
  ) {}
}

export class AuthPasswordRecoveryDTO {
  constructor(
    public email: string,
  ) {}
}

export class AuthNewPasswordDTO {
  constructor(
    public newPassword: string,
    public recoveryCode: string,
  ) {}
}

export class AuthRegistrationDTO {
  constructor(
    public login: string,
    public email: string,
    public password: string,
  ) {}
}

export class AuthRegistrationConfirmationDTO {
  constructor(
    public code: string,
  ) {}
}

export class AuthEmailResendingDTO {
  constructor(
    public email: string,
  ) {}
}
