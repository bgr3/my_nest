import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { JWTTokens } from './tokens-orm-entity';

@Entity()
export class AuthORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp without time zone' })
  issuedAt: Date;

  @Column({ type: 'timestamp without time zone' })
  expiredAt: Date;

  @Column()
  deviceId: string;

  @Column()
  deviceIP: string;

  @Column()
  deviceName: string;

  @Column()
  userId: string;

  @OneToOne(() => JWTTokens, (jwtTokens) => jwtTokens.authORM, {
    eager: true,
    cascade: true,
  })
  JWTTokens: JWTTokens;

  updateAuthSession(
    accessToken: string,
    refreshToken: string,
    issuedAt: Date,
    expiredAt: Date,
  ): void {
    this.issuedAt = issuedAt;
    this.expiredAt = expiredAt;
    this.JWTTokens.accessToken = accessToken;
    this.JWTTokens.refreshToken = refreshToken;
  }

  static createAuth(
    userId: string,
    deviceIP: string,
    deviceId: string,
    deviceName: string,
    accessToken: string,
    refreshToken: string,
    issuedAt: Date,
    expiredAt: Date,
  ): AuthORM {
    const auth = new this();

    auth.issuedAt = issuedAt;
    auth.expiredAt = expiredAt;
    auth.deviceId = deviceId;
    auth.deviceIP = deviceIP;
    auth.deviceName = deviceName;
    auth.userId = userId;
    auth.JWTTokens = new JWTTokens();
    auth.JWTTokens.accessToken = accessToken;
    auth.JWTTokens.refreshToken = refreshToken;

    return auth;
  }
}
