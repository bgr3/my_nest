import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { GameORM } from '../domain/game-orm-entity';

export class GameORMRepository {
  constructor(
    @InjectRepository(GameORM)
    private readonly gameRepository: Repository<GameORM>,
  ) {}

  async testAllData(): Promise<void> {
    await this.gameRepository.delete({});
    return;
  }

  async save(game: GameORM): Promise<string | null> {
    const questionResult = await this.gameRepository.save(game);

    return questionResult.id;
  }

  async getGameById(id: string): Promise<GameORM | null> {
    let game: GameORM | null;

    try {
      game = await this.gameRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!game) return null;

    game.questions.sort((a, b) =>
      a.questionNumber > b.questionNumber ? 1 : -1,
    );

    return game;
  }

  async getActiveGameByUserId(userId: string): Promise<GameORM | null> {
    let game: GameORM | null;

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
        .where('(fp.id = :fId OR sp.id = :sId) AND g.status = :status', {
          fId: userId,
          sId: userId,
          status: 'Active',
        })
        .getOne();
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!game) return null;

    game.questions.sort((a, b) =>
      a.questionNumber > b.questionNumber ? 1 : -1,
    );

    return game;
  }

  async getActiveOrPendingGameByUserId(
    userId: string,
  ): Promise<GameORM | null> {
    let game: GameORM | null;

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
          '(fp.id = :fId OR sp.id = :sId) AND (g.status = :status1 OR g.status = :status2)',
          {
            fId: userId,
            sId: userId,
            status1: 'Active',
            status2: 'PendingSecondPlayer',
          },
        )
        .getOne();
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!game) return null;

    game.questions.sort((a, b) =>
      a.questionNumber > b.questionNumber ? 1 : -1,
    );

    return game;
  }

  async getFinishedGamesByUserId(
    userId: string,
    entityManager?: EntityManager,
  ): Promise<GameORM[]> {
    const gameRepository = this._getUserRepository(entityManager);
    let games: GameORM[];

    try {
      games = await gameRepository
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
        .where('(fp.id = :fId OR sp.id = :sId) AND g.status = :status1', {
          fId: userId,
          sId: userId,
          status1: 'Finished',
        })
        .getMany();
    } catch (err) {
      console.log(err);
      return [];
    }

    return games;
  }

  async getPendingGame(): Promise<GameORM | null> {
    let game;

    try {
      game = await this.gameRepository.findOne({
        where: {
          status: 'PendingSecondPlayer',
        },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    return game;
  }

  async getActiveGames(): Promise<GameORM[] | []> {
    let games: GameORM[];

    try {
      games = await this.gameRepository.find({
        where: {
          status: 'Active',
        },
      });
    } catch (err) {
      console.log(err);

      return [];
    }

    games.forEach((i) => {
      i.firstPlayerProgress.answers.sort((a, b) =>
        a.addedAt > b.addedAt ? 1 : -1,
      );
    });

    return games;
  }

  async deletegame(
    id: string,
    entityManager?: EntityManager,
  ): Promise<boolean> {
    const gameRepository = this._getUserRepository(entityManager);
    // let result;

    // try {
    const result = await gameRepository.delete(id);
    // } catch (err) {
    //   console.log(err);

    //   return false;
    // }

    if (result.affected === 0) return false;

    return true;
  }

  private _getUserRepository(
    entityManager?: EntityManager,
  ): Repository<GameORM> {
    let gameRepository = this.gameRepository;
    if (entityManager) {
      gameRepository = entityManager.getRepository(GameORM);
    }

    return gameRepository;
  }
}
