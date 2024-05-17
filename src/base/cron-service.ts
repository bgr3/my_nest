import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { add } from 'date-fns/add';

import { GameORM } from '../features/pair-quiz-game/domain/game-orm-entity';
import { GameORMRepository } from '../features/pair-quiz-game/infrastructure/game-orm-repository';

@Injectable()
export class TasksService {
  constructor(private readonly gameRepository: GameORMRepository) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron(): Promise<void> {
    const notFinishedGames = await this.gameRepository.getActiveGames();

    notFinishedGames.forEach(async (game: GameORM) => {
      if (
        game.firstPlayerProgress.answers.length == 5 &&
        add(game.firstPlayerProgress.answers[4].addedAt, { seconds: 9 }) <=
          new Date()
      ) {
        const count = game.secondPlayerProgress!.answers.length;

        for (let i = 0; i < 5 - count; i++) {
          game.secondPlayerAnswer('');
        }

        await this.gameRepository.save(game);
      }

      if (
        game.secondPlayerProgress!.answers.length == 5 &&
        add(game.secondPlayerProgress!.answers[4].addedAt, { seconds: 9 }) <=
          new Date()
      ) {
        const count = game.firstPlayerProgress.answers.length;

        for (let i = 0; i < 5 - count; i++) {
          game.firstPlayerAnswer('');
        }
        await this.gameRepository.save(game);
      }
    });
  }
}
