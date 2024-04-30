import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async save(question: GameORM): Promise<string | null> {
    const questionResult = await this.gameRepository.save(question);

    return questionResult.id;
  }

  async getGameById(id: string): Promise<GameORM | null> {
    let game;

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

    return game;
  }

  async getActiveGameByUserId(userId: string): Promise<GameORM | null> {
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

    return game;
  }

  async getActiveOrPendingGameByUserId(
    userId: string,
  ): Promise<GameORM | null> {
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

    return game;
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

  async deletegame(id: string): Promise<boolean> {
    let result;

    try {
      result = await this.gameRepository.delete(id);
    } catch (err) {
      console.log(err);

      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }
}
