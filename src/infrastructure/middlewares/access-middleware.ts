import { HttpException, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AccessService } from '../../features/access/application/access-service'
import { HTTP_STATUSES } from '../../settings/http-statuses'

@Injectable()
export class AccessFrequencyMiddleware implements NestMiddleware {
    constructor(
        protected accessService: AccessService,
        ){}
    async use(req: Request, res: Response, next: NextFunction) {
        const result = await this.accessService.checkaccessFrequency(req.url, req.ip!)                

        if (result) {
            next()
        } else {
            throw new HttpException('', HTTP_STATUSES.TOO_MANY_REQUESTS_429);
        }
    }
}