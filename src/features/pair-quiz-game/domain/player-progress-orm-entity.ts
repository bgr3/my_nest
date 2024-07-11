import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserORM } from '../../users/domain/entities/users-orm-entity';
import { AnswerHistoryORM } from './answers-orm-entity';
import { GameORM } from './game-orm-entity';

@Entity()
export class PlayerProgressORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => AnswerHistoryORM,
    (answerHistoryORM) => answerHistoryORM.playerProgress,
    {
      eager: true,
      cascade: true,
    },
  )
  answers: AnswerHistoryORM[];

  @ManyToOne(() => UserORM, (player) => player.playerProgressId, {
    eager: true,
    onDelete: 'CASCADE',
  })
  player: UserORM;
  @Column({ type: 'uuid' })
  playerId: string;

  @Column()
  score: number = 0;

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

  pushAnswer(answer: AnswerHistoryORM): void {
    this.answers.push(answer);

    return;
  }

  static createPlayerProgress(player: UserORM): PlayerProgressORM {
    const playerProgress = new this();

    playerProgress.player = player;

    return playerProgress;
  }
}
