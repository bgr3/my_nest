import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { UserORM } from '../../users/domain/users-orm-entity';
import { StatisticOutputDTO } from '../api/dto/output/game-output-dto';

@Entity()
export class StatisticORM {
  @Column()
  sumScore: number;

  @Column({ type: 'decimal' })
  avgScores: number;

  @Column()
  gamesCount: number;

  @Column()
  winsCount: number;

  @Column()
  lossesCount: number;

  @Column()
  drawsCount: number;

  @OneToOne(() => UserORM, (player) => player.statisticId, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  player: UserORM;
  @PrimaryColumn({ type: 'uuid' })
  playerId: string;

  updateStatistic(statisticDTO: StatisticOutputDTO): void {
    this.sumScore = statisticDTO.sumScore;
    this.avgScores = statisticDTO.avgScores;
    this.gamesCount = statisticDTO.gamesCount;
    this.winsCount = statisticDTO.winsCount;
    this.lossesCount = statisticDTO.lossesCount;
    this.drawsCount = statisticDTO.drawsCount;

    return;
  }

  static createStatistic(
    statisticDTO: StatisticOutputDTO,
    userId: string,
  ): StatisticORM {
    const statistic = new this();

    statistic.sumScore = statisticDTO.sumScore;
    statistic.avgScores = statisticDTO.avgScores;
    statistic.gamesCount = statisticDTO.gamesCount;
    statistic.winsCount = statisticDTO.winsCount;
    statistic.lossesCount = statisticDTO.lossesCount;
    statistic.drawsCount = statisticDTO.drawsCount;
    statistic.playerId = userId;

    return statistic;
  }
}
