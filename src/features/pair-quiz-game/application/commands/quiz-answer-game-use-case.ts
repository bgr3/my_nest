import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QuizAnswerDTO } from '../../api/dto/input/quiz-input-dto';
import { AnswerHistoryORM } from '../../domain/answers-orm-entity';
import { GameORMQueryRepository } from '../../infrastructure/game-orm-query-repository';
import { GameORMRepository } from '../../infrastructure/game-orm-repository';
import { AnswerDTO } from '../dto/game-dto';

export class QuizAnswerGameCommand {
  constructor(
    public userId: string,
    public dto: QuizAnswerDTO,
  ) {}
}

@CommandHandler(QuizAnswerGameCommand)
export class QuizAnswerUseCase
  implements ICommandHandler<QuizAnswerGameCommand>
{
  constructor(
    private readonly gameRepository: GameORMRepository,
    private readonly gameQueryRepository: GameORMQueryRepository,
  ) {}

  async execute(command: QuizAnswerGameCommand): Promise<AnswerDTO | null> {
    const game = await this.gameRepository.getActiveGameByUserId(
      command.userId,
    );

    if (!game) return null;

    let firstPlayerResult: AnswerHistoryORM | null = null;
    let secondPlayerResult: AnswerHistoryORM | null = null;

    if (game.firstPlayerProgress.player.id == command.userId) {
      firstPlayerResult = game.firstPlayerAnswer(command.dto.answer);
      if (!firstPlayerResult) return null;
    }

    if (game.secondPlayerProgress!.player.id == command.userId) {
      secondPlayerResult = game.secondPlayerAnswer(command.dto.answer);
      if (!secondPlayerResult) return null;
    }

    if (firstPlayerResult || secondPlayerResult)
      await this.gameRepository.save(game);

    if (
      game.firstPlayerProgress.answers.length === 5 ||
      game.secondPlayerProgress?.answers.length === 5
    ) {
      setTimeout(async () => {
        const notFinishedGame = await this.gameRepository.getGameById(game.id);

        if (!notFinishedGame) return;

        if (
          notFinishedGame.firstPlayerProgress.answers.length == 5 &&
          notFinishedGame.status === 'Active'
        ) {
          const count = notFinishedGame.secondPlayerProgress!.answers.length;

          for (let i = 0; i < 5 - count; i++) {
            notFinishedGame.secondPlayerAnswer('');
          }

          await this.gameRepository.save(notFinishedGame);
        }

        if (
          notFinishedGame.secondPlayerProgress!.answers.length == 5 &&
          notFinishedGame.status === 'Active'
        ) {
          const count = notFinishedGame.firstPlayerProgress.answers.length;

          for (let i = 0; i < 5 - count; i++) {
            notFinishedGame.firstPlayerAnswer('');
          }

          await this.gameRepository.save(notFinishedGame);
        }
      }, 10000);
    }

    const gameRepo = await this.gameQueryRepository.findGameByID(game.id);

    if (!gameRepo) return null;

    let answer;

    if (firstPlayerResult) {
      answer =
        gameRepo.firstPlayerProgress.answers![
          gameRepo.firstPlayerProgress.answers!.length - 1
        ];
    }

    if (secondPlayerResult) {
      answer =
        gameRepo.secondPlayerProgress!.answers![
          gameRepo.secondPlayerProgress!.answers!.length - 1
        ];
    }

    return {
      answer: answer,
      statusGame: gameRepo.status,
      firstPlayerId: gameRepo.firstPlayerProgress.player.id,
      secondPlayerId: gameRepo.secondPlayerProgress
        ? gameRepo.secondPlayerProgress!.player!.id
        : '',
    };
  }
}
