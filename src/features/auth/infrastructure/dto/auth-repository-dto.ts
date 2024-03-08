export class AuthRawDb {
  constructor(
    public Id: string,
    public IssuedAt: Date,
    public ExpiredAt: Date,
    public DeviceId: string,
    public DeviceIP: string,
    public DeviceName: string,
    public UserId: string,
    public AccessToken: string,
    public RefreshToken: string,
  ) {}
}
