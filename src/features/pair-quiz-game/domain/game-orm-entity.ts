import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserORM } from '../../users/domain/entities/users-orm-entity';
import { AnswerHistoryORM } from './answers-orm-entity';
import { GameQuestionsORM } from './game-qusestions-orm-entity';
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

  @OneToMany(() => GameQuestionsORM, (gameQuestion) => gameQuestion.game, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  questions: GameQuestionsORM[];

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
    this.status = 'Active';
    this.startGameDate = new Date();

    return;
  }

  addQuestions(questions: QuestionORM[]): void {
    questions.forEach((value, index) => {
      const question = new GameQuestionsORM();

      question.question = value;
      question.questionNumber = index + 1;

      this.questions ? this.questions.push(question) : [question];
    });

    return;
  }

  firstPlayerAnswer(answer: string): AnswerHistoryORM | null {
    const numberQuestion = this.firstPlayerProgress.answers.length;

    if (numberQuestion == 5) return null;

    const question = this.questions[numberQuestion];

    let answerEntity: AnswerHistoryORM;

    if (question.question.correctAnswers.includes(answer)) {
      answerEntity = AnswerHistoryORM.createAnswerHistory(
        'Correct',
        question.question.id,
      );
      this.firstPlayerProgress.pushAnswer(answerEntity);
      this.firstPlayerProgress.score++;
    } else {
      answerEntity = AnswerHistoryORM.createAnswerHistory(
        'Incorrect',
        question.question.id,
      );
      this.firstPlayerProgress.pushAnswer(answerEntity);
    }

    if (
      numberQuestion == 4 &&
      this.secondPlayerProgress!.answers.length == 5 &&
      this.secondPlayerProgress!.answers.find(
        (i) => i.answerStatus == 'Correct',
      )
    ) {
      this.secondPlayerProgress!.score++;
    }

    if (
      this.firstPlayerProgress.answers.length == 5 &&
      this.secondPlayerProgress!.answers.length == 5
    ) {
      this.status = 'Finished';
      this.finishGameDate = new Date();
    }

    return answerEntity;
  }

  secondPlayerAnswer(answer: string): AnswerHistoryORM | null {
    const numberQuestion = this.secondPlayerProgress!.answers.length;

    if (numberQuestion == 5) return null;

    const question = this.questions[numberQuestion];

    let result: AnswerHistoryORM;

    if (question.question.correctAnswers.includes(answer)) {
      result = AnswerHistoryORM.createAnswerHistory(
        'Correct',
        question.question.id,
      );
      this.secondPlayerProgress!.answers.push(result);
      this.secondPlayerProgress!.score++;
    } else {
      result = AnswerHistoryORM.createAnswerHistory(
        'Incorrect',
        question.question.id,
      );
      this.secondPlayerProgress!.answers.push(result);
    }

    if (
      numberQuestion == 4 &&
      this.firstPlayerProgress.answers.length == 5 &&
      this.firstPlayerProgress.answers.find((i) => i.answerStatus == 'Correct')
    ) {
      this.firstPlayerProgress.score++;
    }

    if (
      this.firstPlayerProgress.answers.length == 5 &&
      this.secondPlayerProgress!.answers.length == 5
    ) {
      this.status = 'Finished';
      this.finishGameDate = new Date();
    }

    return result;
  }

  static createGame(player: UserORM): GameORM {
    const game = new this();

    game.firstPlayerProgress =
      /*new PlayerProgressORM();*/ PlayerProgressORM.createPlayerProgress(
        player,
      );
    // game.firstPlayerProgress.player = player;
    game.status = 'PendingSecondPlayer';
    game.pairCreatedDate = new Date();

    return game;
  }
}

export type GameStatusType = 'PendingSecondPlayer' | 'Active' | 'Finished';
