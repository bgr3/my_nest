import { HttpException, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AccessService } from '../../features/access/application/access-service'
import { HTTP_STATUSES } from '../../settings/http-statuses'
import { CommandBus } from '@nestjs/cqrs'
import { AccessCheckaccessFrequencyCommand } from '../../features/access/application/use-cases/access-check-access-frequency-use-case'

@Injectable()
export class AccessFrequencyMiddleware implements NestMiddleware {
    constructor(
        private readonly commandBus: CommandBus,
        ){}
    async use(req: Request, res: Response, next: NextFunction) {
        const result = await this.commandBus.execute(new AccessCheckaccessFrequencyCommand(req.url, req.ip!));

        if (result) {
            next()
        } else {
            throw new HttpException('', HTTP_STATUSES.TOO_MANY_REQUESTS_429);
        }
    }
}