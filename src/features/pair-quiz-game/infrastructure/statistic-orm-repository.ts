import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StatisticORM } from '../domain/statistic-orm-entity';

export class StatisticORMRepository {
  constructor(
    @InjectRepository(StatisticORM)
    private readonly statisticRepository: Repository<StatisticORM>,
  ) {}

  async testAllData(): Promise<void> {
    await this.statisticRepository.delete({});
    return;
  }

  async save(statistic: StatisticORM): Promise<string | null> {
    const statisticResult = await this.statisticRepository.save(statistic);

    return statisticResult.playerId;
  }

  async getStatisticByPlayerId(playerId: string): Promise<StatisticORM | null> {
    let statistic: StatisticORM | null;

    try {
      statistic = await this.statisticRepository.findOne({
        where: {
          playerId: playerId,
        },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    if (!statistic) return null;

    return statistic;
  }
}
