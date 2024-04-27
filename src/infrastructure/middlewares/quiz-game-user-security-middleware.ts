import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { GameORMRepository } from '../../features/pair-quiz-game/infrastructure/game-orm-repository';
import { HTTP_STATUSES } from '../../settings/http-statuses';

@Injectable()
export class QuizGameUserSecurityMiddleware implements NestMiddleware {
  constructor(protected gameRepository: GameORMRepository) {}
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async use(req: Request, res: Response, next: NextFunction) {
    const gameId = req.params[0];
    const game = await this.gameRepository.getGameById(gameId);
    const userId = req.user;

    if (game && userId) {
      if (
        game.firstPlayerProgress.player.id === userId ||
        game.secondPlayerProgress?.player.id === userId
      ) {
        next();
        return;
      } else {
        throw new HttpException('', HTTP_STATUSES.FORBIDDEN_403);
      }
    }

    next();
  }
}
