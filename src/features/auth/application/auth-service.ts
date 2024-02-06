import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../../users/infrastructure/users-repository';
import { JwtService } from '@nestjs/jwt';
import { Auth, AuthDocument, AuthModelType } from '../domain/auth-entity';
import { add } from 'date-fns/add';
import { AuthRepository } from '../infrastructure/auth-repository';
import { AuthQueryRepository } from '../infrastructure/auth-query-repository';
import { AuthTypeOutput, MeType, Tokens } from '../api/dto/output/auth-output-dto';
import { InjectModel } from '@nestjs/mongoose';
import { EmailManager } from '../../email-manager/application/email-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private AuthModel: AuthModelType,
    protected authRepository: AuthRepository,
    protected authQueryRepository: AuthQueryRepository,
    protected usersRepository: UsersRepository,
    protected jwtService: JwtService,
    protected emailManager: EmailManager,
  ) {}
  async testAllData(): Promise<void> {
    return this.authRepository.testAllData();
  }
  async sendEmail (email: string, subject?: string, message?: string, html?: string) {
      return this.emailManager.sendEmail(email, subject, message, html)
  }

  async confirmEmail(code: string): Promise<boolean> {
      const user = await this.usersRepository.findUserByConfirmationCode(code)
      
      if (!user) return false;

      const result = await user.updateConfirmation();

      if (!result) return false;
      
      await this.usersRepository.save(user);

      return true
  }

  async registerUserSendEmail(id: string): Promise<boolean> {
      let user = await this.usersRepository.findUserDbByID(id)

      if (!user) return false

      await this.emailManager.sendRegistrationEmail(user.emailConfirmation.confirmationCode, user.email)

      return true
  }

  async changePasswordEmail(id: string): Promise<boolean> {
      let user = await this.usersRepository.findUserDbByID(id);

      if (!user) return false

      console.log(user.emailConfirmation.confirmationCode);

      await this.emailManager.sendRecoveryPasswordEmail(user.emailConfirmation.confirmationCode, user.email)

      return true
  }

  async ReSendEmail (email: string): Promise<boolean> {
      const user = await this.usersRepository.findUserByLoginOrEmail(email);

      if (!user) return false;

      const code = uuidv4();

      await user.resendConfirmationCode(code);
      await this.usersRepository.save(user);
      await this.emailManager.sendRegistrationEmail(code, user.email);

      return true
  }

  async getMeById(userId: string): Promise<MeType | null> {
    //const userId = await this.jwtService.verifyAsync(accessToken);
    
    const user = await this.usersRepository.findUserDbByID(userId);

    if (!user) return null;

    const me = user.getMe(userId);

    return me;
  }

  async createAuthSession(
    userId: string,
    deviceIP: string,
    deviceName: string,
  ): Promise<Tokens> {
    const deviceId = uuidv4();
    
    const tokens = await this._generateTokens(userId, deviceId);

    const authSession = Auth.createAuth(
      userId,
      deviceIP,
      deviceId,
      deviceName,
      tokens.accessToken,
      tokens.refreshToken,
      tokens.issuedAt,
      tokens.expireAt,
    );

    const newAuthModel = new this.AuthModel(authSession);

    await this.authRepository.save(newAuthModel);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }



  
  async updateTokens (deviceId: string): Promise<Tokens | null> {
    const session = await this.authRepository.findAuthSessionByDeviceId(deviceId)

    if (!session) return null;

    const user = await this.usersRepository.findUserDbByID(session.userId)
    
    if (!user) return null;

    const tokens = await this._generateTokens(user._id.toString(), deviceId);

    await session.updateAuthSession(tokens.accessToken, tokens.refreshToken, tokens.issuedAt, tokens.expireAt)

    await this.authRepository.save(session)


    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    }
  }

  async getAuthSessionsByToken(deviceId: string): Promise<AuthTypeOutput[] | null> {
    const userSession = await this.authRepository.findAuthSessionByDeviceId(deviceId)

    if (!userSession) return null;

    return await this.authQueryRepository.findAuthSessionsByUserId(userSession.userId)
  }

  async getSingleAuthSessionByToken(deviceId: string): Promise<AuthDocument | null> {
    const userSession = await this.authRepository.findAuthSessionByDeviceId(deviceId)

    return userSession
  }

  async getAuthSessionByDeviceId(deviceId: string): Promise<AuthDocument | null> {
    const userSession = await this.authRepository.findAuthSessionByDeviceId(deviceId)

    return userSession
  }

  async deleteAuthSessionsExcludeCurent(deviceId: string): Promise<boolean> {
    const userSessions = await this.authRepository.findAuthSessionByDeviceId(deviceId)

    if (!userSessions) return false;

    const result = await this.authRepository.deleteAuthSessionsByUserId(userSessions.userId, deviceId)

    if (!result) return false

    return true
  }

  async deleteSpecifiedAuthSessionByDeviceId(deviceId: string): Promise<boolean> {
    const result = await this.authRepository.deleteAuthSessionByDeviceId(deviceId)

    if (!result) return false

    return true
  }

  async deleteAuthSessionByToken(deviceId: string): Promise<boolean> {
    const result = await this.authRepository.deleteAuthSessionByDeviceId(deviceId)
    
    if (!result) return false

    return true
  };

  async _generateTokens(userId: string, deviceId: string){
    const expirationTimeSeconds = 200;
    const issuedAt = new Date();
    const expireAt = add(new Date(), {
      seconds: expirationTimeSeconds,
    });
    
    const accessTokenPayload = { userId: userId };
    const refreshTokenPayload = { deviceId: deviceId };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: 100,
    });

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: expirationTimeSeconds,
    });
    this.jwtService.decode

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      issuedAt: issuedAt,
      expireAt: expireAt,
    };
  }
}
