export class UserOutput {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
    public banInfo: UserBanInfoOutputDTO,
  ) {}
}

export class UserBanInfoOutputDTO {
  constructor(
    public banDate: string | null,
    public banReason: string | null,
    public isBanned: boolean,
  ) {}
}

export class UserBloggerOutput {
  constructor(
    public id: string,
    public login: string,
    public banInfo: UserBanInfoOutputDTO,
  ) {}
}
