import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PlayerProgressORM } from './player-progress-orm-entity';

@Entity()
export class AnswerHistoryORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  questionId: string;

  @Column()
  answerStatus: AnswerStatusType;

  @Column({ type: 'timestamp without time zone' })
  addedAt: Date;

  @ManyToOne(
    () => PlayerProgressORM,
    (playerProgress) => playerProgress.answers,
    {
      onDelete: 'CASCADE',
    },
  )
  playerProgress: PlayerProgressORM;

  @Column({ type: 'uuid' })
  playerProgressId: string;

  // updateAnswerHistory(body: string, correctAnswers: string[]): void {
  //   this.body = body;
  //   this.correctAnswers = correctAnswers;
  //   this.updatedAt = new Date();
  //   return;
  // }

  static createAnswerHistory(
    answerStatus: AnswerStatusType,
    questionId: string,
  ): AnswerHistoryORM {
    const answer = new this();

    answer.questionId = questionId;
    answer.answerStatus = answerStatus;
    answer.addedAt = new Date();

    return answer;
  }
}

export type AnswerStatusType = 'Correct' | 'Incorrect';
