import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { QuizGamesQueryFilter } from '../api/dto/input/quiz-input-dto';
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

  async findGames(
    filter: QuizGamesQueryFilter,
    userId: string,
  ): Promise<Paginator<GameOutputDTO>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';
    const sortBy = `g.${filter.sortBy}`;

    let dbResult;
    try {
      dbResult = await this.gameRepository
        .createQueryBuilder('g')
        .select()
        .leftJoinAndSelect('g.firstPlayerProgress', 'f')
        .leftJoinAndSelect('f.answers', 'fa')
        .leftJoinAndSelect('f.player', 'fp')
        .leftJoinAndSelect('g.secondPlayerProgress', 's')
        .leftJoinAndSelect('s.answers', 'sa')
        .leftJoinAndSelect('s.player', 'sp')
        .leftJoinAndSelect('g.questions', 'q')
        .leftJoinAndSelect('q.question', 'qq')
        .where('fp.id = :fId OR sp.id = :sId', {
          fId: userId,
          sId: userId,
        })
        .orderBy(sortBy, sortDirection)
        .addOrderBy('g.pairCreatedDate', 'DESC')
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
        .leftJoinAndSelect('f.answers', 'fa')
        .leftJoinAndSelect('f.player', 'fp')
        .leftJoinAndSelect('g.secondPlayerProgress', 's')
        .leftJoinAndSelect('s.answers', 'sa')
        .leftJoinAndSelect('s.player', 'sp')
        .leftJoinAndSelect('g.questions', 'q')
        .leftJoinAndSelect('q.question', 'qq')
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
        .leftJoinAndSelect('f.answers', 'fa')
        .leftJoinAndSelect('f.player', 'fp')
        .leftJoinAndSelect('g.secondPlayerProgress', 's')
        .leftJoinAndSelect('s.answers', 'sa')
        .leftJoinAndSelect('s.player', 'sp')
        .leftJoinAndSelect('g.questions', 'q')
        .leftJoinAndSelect('q.question', 'qq')
        .where(
          '(fp.id = :fId OR sp.id = :sId) AND (g.status = :status OR g.status = :status2)',
          {
            fId: userId,
            sId: userId,
            status: 'Active',
            status2: 'PendingSecondPlayer',
          },
        )
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
  if (game.questions.length > 0) {
    // console.log(game.questions);

    game.questions.sort((a, b) =>
      a.questionNumber > b.questionNumber ? 1 : -1,
    );
  }

  return {
    id: game.id,

    firstPlayerProgress: {
      answers: game.firstPlayerProgress.answers
        .sort((a, b) => (a.addedAt > b.addedAt ? 1 : -1))
        .map((answer) => answersMapper(answer)),

      player: {
        id: game.firstPlayerProgress.player.id,
        login: game.firstPlayerProgress.player.login,
      },

      score: game.firstPlayerProgress.score,
    },

    secondPlayerProgress: game.secondPlayerProgress
      ? {
          answers: game.secondPlayerProgress.answers
            .sort((a, b) => (a.addedAt > b.addedAt ? 1 : -1))
            .map((answer) => answersMapper(answer)),

          player: {
            id: game.secondPlayerProgress.player.id,
            login: game.secondPlayerProgress.player.login,
          },

          score: game.secondPlayerProgress.score,
        }
      : null,
    questions:
      game.questions.length > 0
        ? game.questions.map((question) => {
            return questionMapper(question.question);
          })
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
