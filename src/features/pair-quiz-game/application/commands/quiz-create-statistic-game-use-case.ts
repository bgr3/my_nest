import { CommandHandler } from '@nestjs/cqrs';
import { DataSource, EntityManager } from 'typeorm';

import { TransactionalCommandHandler } from '../../../../base/transaction-command-handler';
import { StatisticOutputDTO } from '../../api/dto/output/game-output-dto';
import { StatisticORM } from '../../domain/statistic-orm-entity';
import { GameORMRepository } from '../../infrastructure/game-orm-repository';
import { StatisticORMRepository } from '../../infrastructure/statistic-orm-repository';

export class QuizCreateStatisticGameCommand {
  constructor(public userId: string) {}
}

@CommandHandler(QuizCreateStatisticGameCommand)
export class QuizCreateStatisticUseCase extends TransactionalCommandHandler<QuizCreateStatisticGameCommand> {
  constructor(
    private readonly gameRepository: GameORMRepository,
    private readonly statisticRepository: StatisticORMRepository,
    dataSource: DataSource,
  ) {
    super(dataSource);
  }

  protected async handle(
    command: QuizCreateStatisticGameCommand,
    entityManager: EntityManager,
  ): Promise<void> {
    const games = await this.gameRepository.getFinishedGamesByUserId(
      command.userId,
      entityManager,
    );

    const statistic: StatisticOutputDTO = {
      sumScore: games.reduce((acc, i) => {
        let playerProgress: string;

        if (i.firstPlayerProgress.player.id == command.userId) {
          playerProgress = 'firstPlayerProgress';
        } else {
          playerProgress = 'secondPlayerProgress';
        }

        const score = i[playerProgress].score;

        return acc + score;
      }, 0),

      avgScores: Number(
        (
          games.reduce((acc, i) => {
            let playerProgress: string;

            if (i.firstPlayerProgress.player.id == command.userId) {
              playerProgress = 'firstPlayerProgress';
            } else {
              playerProgress = 'secondPlayerProgress';
            }

            const score = i[playerProgress].score;

            return acc + score;
          }, 0) / games.length
        ).toFixed(2),
      ),

      gamesCount: games.length,

      winsCount: games.reduce((acc, i) => {
        let playerProgress: string;
        let secondPlayerProgress: string;

        if (i.firstPlayerProgress.player.id == command.userId) {
          playerProgress = 'firstPlayerProgress';
          secondPlayerProgress = 'secondPlayerProgress';
        } else {
          playerProgress = 'secondPlayerProgress';
          secondPlayerProgress = 'firstPlayerProgress';
        }

        if (i[playerProgress].score > i[secondPlayerProgress].score) {
          acc++;
          return acc;
        } else {
          return acc;
        }
      }, 0),

      lossesCount: games.reduce((acc, i) => {
        let playerProgress: string;
        let secondPlayerProgress: string;

        if (i.firstPlayerProgress.player.id == command.userId) {
          playerProgress = 'firstPlayerProgress';
          secondPlayerProgress = 'secondPlayerProgress';
        } else {
          playerProgress = 'secondPlayerProgress';
          secondPlayerProgress = 'firstPlayerProgress';
        }

        if (i[playerProgress].score < i[secondPlayerProgress].score) {
          acc++;
          return acc;
        } else {
          return acc;
        }
      }, 0),

      drawsCount: games.reduce((acc, i) => {
        let playerProgress: string;
        let secondPlayerProgress: string;

        if (i.firstPlayerProgress.player.id == command.userId) {
          playerProgress = 'firstPlayerProgress';
          secondPlayerProgress = 'secondPlayerProgress';
        } else {
          playerProgress = 'secondPlayerProgress';
          secondPlayerProgress = 'firstPlayerProgress';
        }

        if (i[playerProgress].score == i[secondPlayerProgress].score) {
          acc++;
          return acc;
        } else {
          return acc;
        }
      }, 0),
    };

    const statisticDb = await this.statisticRepository.getStatisticByPlayerId(
      command.userId,
    );

    if (statisticDb) {
      statisticDb.updateStatistic(statistic);

      await this.statisticRepository.save(statisticDb);
    } else {
      const statisticORM = StatisticORM.createStatistic(
        statistic,
        command.userId,
      );

      await this.statisticRepository.save(statisticORM);
    }

    return;
  }
}

// export class DeleteUserCommand {
//   constructor(public userId: number) {}
// }
// //TODO показать класс
// @CommandHandler(DeleteUserCommand)
// export class DeleteUserUseCase extends TransactionalCommandHandler<DeleteUserCommand> {
//   constructor(
//     private userRepository: UserRepository,
//     private sessionService: SessionService,
//     dataSource: DataSource,
//   ) {
//     super(dataSource);
//   }

//   protected async handle(
//     { userId }: DeleteUserCommand,
//     entityManager: EntityManager,
//   ): Promise<string> {
//     const userIsExist = await this.userRepository.checkIsExitsById(
//       userId,
//       entityManager,
//     );
//     if (!userIsExist)
//       return Result.Err(ErrorStatus.NOT_FOUND, `User ${userId} not found`);

//     // Деактивация всех сессий пользователя
//     await this.sessionService.terminateAllSession(userId, entityManager);
//     // Отметка пользователя как удаленного

//     await this.userRepository.deleteById(userId, entityManager);

//     return Result.Ok(`User ${userId} deleted`);
//   }
// }
