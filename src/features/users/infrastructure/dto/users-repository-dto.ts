export class UserRawDb {
  constructor(
    public Id: string,
    public Login: string,
    public Email: string,
    public Password: string,
    public CreatedAt: string,
    public UserId: string,
    public ConfirmationCode: string,
    public ExpirationDate: object,
    public IsConfirmed: boolean,
    public NextSend: object,
  ) {}
}
