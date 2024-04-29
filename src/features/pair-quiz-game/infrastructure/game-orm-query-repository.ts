import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryFilter } from '../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import {
  AnswersOutputDTO,
  GameOutputDTO,
  GameQuestionOutputDTO,
} from '../api/dto/output/game-output-dto';
import { AnswerHistoryORM } from '../domain/answers-orm-entity';
import { GameORM } from '../domain/game-orm-entity';
import { QuestionORM } from '../domain/questions-orm-entity';

export class GameORMQueryRepository {
  constructor(
    @InjectRepository(GameORM)
    private readonly gameRepository: Repository<GameORM>,
  ) {}

  async findGames(filter: QueryFilter): Promise<Paginator<GameOutputDTO>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';

    let dbResult;
    try {
      dbResult = await this.gameRepository
        .createQueryBuilder('g')
        .select()
        .orderBy(filter.sortBy, sortDirection)
        .skip(skip)
        .take(filter.pageSize)
        .getManyAndCount();
    } catch (err) {
      console.log(err);
      dbResult = [[], 0];
    }

    const dbCount = dbResult[1];

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult[0].map((q: GameORM) => gameMapper(q)),
    };

    return paginator;
  }

  async findGameByID(id: string): Promise<GameOutputDTO | null> {
    let game;

    try {
      game = await this.gameRepository
        .createQueryBuilder('g')
        .select()
        .leftJoinAndSelect('g.firstPlayerProgress', 'f')
        .leftJoinAndSelect('f.player', 'fp')
        .leftJoinAndSelect('g.secondPlayerProgress', 's')
        .leftJoinAndSelect('s.player', 'sp')
        .leftJoinAndSelect('g.questions', 'q')
        .where('g.id = :id', {
          id: id,
        })
        .getOne();
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!game) return null;

    return gameMapper(game);
  }

  async findGameByUserID(userId: string): Promise<GameOutputDTO | null> {
    let game;

    try {
      game = await this.gameRepository
        .createQueryBuilder('g')
        .select()
        .leftJoinAndSelect('g.firstPlayerProgress', 'f')
        .leftJoinAndSelect('f.player', 'fp')
        .leftJoinAndSelect('g.secondPlayerProgress', 'sp')
        .leftJoinAndSelect('sp.player', 'spp')
        .leftJoinAndSelect('g.questions', 'q')
        .where('fp.id = :fId OR spp.id = :sId', {
          fId: userId,
          sId: userId,
        })
        .getOne();
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!game) return null;

    return gameMapper(game);
  }
}

const gameMapper = (game: GameORM): GameOutputDTO => {
  console.log(game);

  return {
    id: game.id,

    firstPlayerProgress: {
      answers: game.firstPlayerProgress.answers
        ? game.firstPlayerProgress.answers.map((answer) =>
            answersMapper(answer),
          )
        : null,

      player: {
        id: game.firstPlayerProgress.player.id,
        login: game.firstPlayerProgress.player.login,
      },

      score: game.firstPlayerProgress.score,
    },

    secondPlayerProgress: game.secondPlayerProgress
      ? {
          answers: game.secondPlayerProgress.answers
            ? game.secondPlayerProgress.answers.map((answer) =>
                answersMapper(answer),
              )
            : null,

          player: {
            id: game.secondPlayerProgress.player.id,
            login: game.secondPlayerProgress.player.login,
          },

          score: game.secondPlayerProgress.score,
        }
      : null,
    questions:
      game.questions.length > 0
        ? game.questions.map((question) => questionMapper(question))
        : null,
    status: game.status,
    pairCreatedDate: game.pairCreatedDate
      ? game.pairCreatedDate.toISOString()
      : null,
    startGameDate: game.startGameDate ? game.startGameDate.toISOString() : null,
    finishGameDate: game.finishGameDate
      ? game.finishGameDate.toISOString()
      : null,
  };
};

const answersMapper = (answer: AnswerHistoryORM): AnswersOutputDTO => {
  return {
    questionId: answer.questionId,
    answerStatus: answer.answerStatus,
    addedAt: answer.addedAt.toISOString(),
  };
};

const questionMapper = (question: QuestionORM): GameQuestionOutputDTO => {
  return {
    id: question.id,
    body: question.body,
  };
};
