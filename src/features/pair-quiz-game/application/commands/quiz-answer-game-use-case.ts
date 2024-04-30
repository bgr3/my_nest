import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QuizAnswerDTO } from '../../api/dto/input/quiz-input-dto';
import { AnswersOutputDTO } from '../../api/dto/output/game-output-dto';
import { AnswerHistoryORM } from '../../domain/answers-orm-entity';
import { GameORMQueryRepository } from '../../infrastructure/game-orm-query-repository';
import { GameORMRepository } from '../../infrastructure/game-orm-repository';

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

  async execute(
    command: QuizAnswerGameCommand,
  ): Promise<AnswersOutputDTO | null> {
    const game = await this.gameRepository.getGameByUserId(command.userId);

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

    const gameRepo = await this.gameQueryRepository.findGameByID(game.id);

    let answer;

    if (firstPlayerResult) {
      answer =
        gameRepo!.firstPlayerProgress.answers![
          gameRepo!.firstPlayerProgress.answers!.length - 1
        ];
    }

    if (secondPlayerResult) {
      answer =
        gameRepo!.secondPlayerProgress!.answers![
          gameRepo!.secondPlayerProgress!.answers!.length - 1
        ];
    }

    return answer;
  }
}
