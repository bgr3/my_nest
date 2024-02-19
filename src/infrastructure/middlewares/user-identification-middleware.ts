import { HttpException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUSES } from '../../settings/http-statuses'
import { CommandBus } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../features/auth/infrastructure/auth-repository';

@Injectable()
export class UserIdentificationMiddleware implements NestMiddleware {
    constructor(
        private readonly commandBus: CommandBus,
        protected jwtService: JwtService,
        private readonly authRepository: AuthRepository,
        ){}
    async use(req: Request, res: Response, next: NextFunction) {
        const accessToken = req.headers.authorization?.split(' ')

        let userId = ''
        
        if (!accessToken) {
            next()
            return
        }
         
        if (accessToken[0] === 'Bearer') {
            const accessSession = await this.authRepository.findAuthSessionByAccessToken(accessToken[1])
            
            if(!accessSession) throw new UnauthorizedException()

            try {
                const userIdVerification = await this.jwtService.verifyAsync(accessToken[1]);
                userId = userIdVerification.userId
            } catch (err) {}
        }
        
        req.user = userId
        
        next()
    }
}