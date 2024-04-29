import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserORM } from '../../users/domain/users-orm-entity';
import { AnswerHistoryORM } from './answers-orm-entity';
import { PlayerProgressORM } from './player-progress-orm-entity';
import { QuestionORM } from './questions-orm-entity';

@Entity()
export class GameORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(
    () => PlayerProgressORM,
    (playerProgressORM) => playerProgressORM.game1,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  firstPlayerProgress: PlayerProgressORM;

  @OneToOne(
    () => PlayerProgressORM,
    (playerProgressORM) => playerProgressORM.game2,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  secondPlayerProgress: PlayerProgressORM | null;

  @ManyToMany(() => QuestionORM, (question) => question.game, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  questions: QuestionORM[];

  @Column()
  status: GameStatusType;

  @Column({ type: 'timestamp without time zone', nullable: true })
  pairCreatedDate: Date | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  startGameDate: Date | null;

  @Column({ type: 'timestamp without time zone', nullable: true })
  finishGameDate: Date | null;

  addSecondPlayer(secondPlayer: UserORM): void {
    this.secondPlayerProgress =
      PlayerProgressORM.createPlayerProgress(secondPlayer);
    this.firstPlayerProgress.score = 0;
    this.secondPlayerProgress.score = 0;
    this.status = 'Active';
    this.pairCreatedDate = new Date();
    this.startGameDate = new Date();

    return;
  }

  addQuestions(questions: QuestionORM[]): void {
    this.questions = [...questions];

    return;
  }

  firstPlayerAnswer(answer: string): AnswerHistoryORM | null {
    const numberQuestion = this.firstPlayerProgress.answers.length;

    if (numberQuestion == 5) return null;

    const question = this.questions[numberQuestion];

    if (question.correctAnswers.includes(answer)) {
      const answer = AnswerHistoryORM.createAnswerHistory(
        'Correct',
        question.id,
      );
      this.firstPlayerProgress.answers.push(answer);
      this.firstPlayerProgress.score++;

      if (
        numberQuestion == 4 &&
        this.secondPlayerProgress!.answers.length < 5 &&
        this.firstPlayerProgress.answers.find(
          (i) => i.answerStatus == 'Correct',
        )
      ) {
        this.firstPlayerProgress.score++;
      }
      return answer;
    } else {
      const answer = AnswerHistoryORM.createAnswerHistory(
        'Incorrect',
        question.id,
      );
      this.firstPlayerProgress.answers.push(answer);

      return answer;
    }
  }

  secondPlayerAnswer(answer: string): AnswerHistoryORM | null {
    const numberQuestion = this.secondPlayerProgress!.answers.length;

    if (numberQuestion == 5) return null;

    const question = this.questions[numberQuestion];

    if (question.correctAnswers.includes(answer)) {
      const answer = AnswerHistoryORM.createAnswerHistory(
        'Correct',
        question.id,
      );
      this.secondPlayerProgress!.answers.push(answer);
      this.secondPlayerProgress!.score++;

      if (
        numberQuestion == 4 &&
        this.firstPlayerProgress.answers.length < 5 &&
        this.secondPlayerProgress!.answers.find(
          (i) => i.answerStatus == 'Correct',
        )
      ) {
        this.secondPlayerProgress!.score++;
      }
      return answer;
    } else {
      const answer = AnswerHistoryORM.createAnswerHistory(
        'Incorrect',
        question.id,
      );
      this.secondPlayerProgress!.answers.push(answer);

      return answer;
    }
  }

  static createGame(player: UserORM): GameORM {
    const game = new this();

    game.firstPlayerProgress =
      /*new PlayerProgressORM();*/ PlayerProgressORM.createPlayerProgress(
        player,
      );
    // game.firstPlayerProgress.player = player;
    game.status = 'PendingSecondPlayer';

    return game;
  }
}

export type GameStatusType = 'PendingSecondPlayer' | 'Active';
