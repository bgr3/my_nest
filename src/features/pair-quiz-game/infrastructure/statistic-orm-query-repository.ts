import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { QuizTopGamesQueryFilter } from '../api/dto/input/quiz-input-dto';
import {
  StatisticOutputDTO,
  TopPlayerOutputDTO,
} from '../api/dto/output/game-output-dto';
import { StatisticORM } from '../domain/statistic-orm-entity';

const statisticNull = {
  sumScore: 0,
  avgScores: 0,
  gamesCount: 0,
  winsCount: 0,
  lossesCount: 0,
  drawsCount: 0,
};

export class StatisticORMQueryRepository {
  constructor(
    @InjectRepository(StatisticORM)
    private readonly statisticRepository: Repository<StatisticORM>,
  ) {}

  async findStatistics(
    filter: QuizTopGamesQueryFilter,
  ): Promise<Paginator<StatisticOutputDTO>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    // const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';
    // const sortBy = `s.${filter.sortBy}`;

    let dbResult;

    try {
      const qb = this.statisticRepository
        .createQueryBuilder('s')
        .select()
        .leftJoinAndSelect('s.player', 'p')
        .orderBy(
          `s.${filter.sort[0].split(' ')[0]}`,
          filter.sort[0].split(' ')[1] == 'asc' ? 'ASC' : 'DESC',
        );

      for (let i = 1; i < filter.sort.length; i++) {
        qb.addOrderBy(
          `s.${filter.sort[i].split(' ')[0]}`,
          filter.sort[i].split(' ')[1] == 'asc' ? 'ASC' : 'DESC',
        );
      }

      dbResult = await qb
        .skip(skip)
        .take(filter.pageSize) //limit вместо take почему-то
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
      items: dbResult[0].map((s: StatisticORM) => topStatisticMapper(s)),
    };

    return paginator;
  }

  // async findStatisticByID(id: string): Promise<StatisticOutputDTO> {
  //   let statistic;

  //   try {
  //     statistic = await this.statisticRepository
  //       .createQueryBuilder('s')
  //       .select()
  //       .where('s.playerId = :id', {
  //         id: id,
  //       })
  //       .getOne();
  //   } catch (err) {
  //     console.log(err);
  //     return statisticNull;
  //   }

  //   if (!statistic) return statisticNull;

  //   return statisticMapper(statistic);
  // }

  async findStatisticByUserID(userId: string): Promise<StatisticOutputDTO> {
    let statistic;

    try {
      statistic = await this.statisticRepository
        .createQueryBuilder('s')
        .select()
        .where('s.playerId = :userId', {
          userId: userId,
        })
        .getOne();
    } catch (err) {
      console.log(err);
      return statisticNull;
    }

    if (!statistic) return statisticNull;

    return statisticMapper(statistic);
  }
}

const statisticMapper = (statistic: StatisticORM): StatisticOutputDTO => {
  return {
    sumScore: statistic.sumScore,
    avgScores: Number(statistic.avgScores),
    gamesCount: statistic.gamesCount,
    winsCount: statistic.winsCount,
    lossesCount: statistic.lossesCount,
    drawsCount: statistic.drawsCount,
  };
};

const topStatisticMapper = (statistic: StatisticORM): TopPlayerOutputDTO => {
  return {
    sumScore: statistic.sumScore,
    avgScores: Number(statistic.avgScores),
    gamesCount: statistic.gamesCount,
    winsCount: statistic.winsCount,
    lossesCount: statistic.lossesCount,
    drawsCount: statistic.drawsCount,
    player: {
      id: statistic.player.id,
      login: statistic.player.login,
    },
  };
};
