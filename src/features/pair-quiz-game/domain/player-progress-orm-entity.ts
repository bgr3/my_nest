import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserORM } from '../../users/domain/users-orm-entity';
import { AnswerHistoryORM } from './answers-orm-entity';
import { GameORM } from './game-orm-entity';

@Entity()
export class PlayerProgressORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => AnswerHistoryORM,
    (answerHistoryORM) => answerHistoryORM.playerProgressId,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  answers: AnswerHistoryORM[];

  @ManyToOne(() => UserORM, (player) => player.playerProgressId, {
    nullable: true,
    eager: true,
    // cascade: true,
  })
  player: UserORM;
  @Column({ type: 'uuid' })
  playerId: string;

  @Column({ nullable: true })
  score: number;

  @OneToOne(() => GameORM, (game) => game.firstPlayerProgress, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  game1: GameORM;
  @Column({ type: 'uuid', nullable: true })
  game1Id: string;

  @OneToOne(() => GameORM, (game) => game.secondPlayerProgress, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  game2: GameORM;
  @Column({ type: 'uuid', nullable: true })
  game2Id: string;

  // updateAnswerHistory(body: string, correctAnswers: string[]): void {
  //   this.body = body;
  //   this.correctAnswers = correctAnswers;
  //   this.updatedAt = new Date();
  //   return;
  // }

  static createPlayerProgress(player: UserORM): PlayerProgressORM {
    const playerProgress = new this();

    playerProgress.player = player;

    return playerProgress;
  }
}
