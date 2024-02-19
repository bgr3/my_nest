import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),        
        JwtStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userId = payload.userId
    const deviceId = payload.deviceId
    
    return userId || deviceId;
  }

  private static extractJWT(req: RequestType): string | null {   
    if (
      req.cookies &&
      'refreshToken' in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {      
      return req.cookies.refreshToken;
    }    
    return null;
  }
}
