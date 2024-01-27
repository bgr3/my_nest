export class AuthTypeOutput {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: string,
    public deviceId: string,
  ) {}
}

export class MeType {
  constructor(
    public email: string,
    public login: string,
    public userId: string,
  ) {}
}

export class LoginResponseType {
  constructor(public accessToken: string) {}
}

export class Tokens {
  constructor(
    public accessToken: string,
    public refreshToken: string,
  ) {}
}
