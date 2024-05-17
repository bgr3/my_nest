import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { GameORM } from './game-orm-entity';
import { QuestionORM } from './questions-orm-entity';

@Entity()
export class GameQuestionsORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GameORM, (game) => game.questions, {
    onDelete: 'CASCADE',
  })
  game: GameORM;
  @Column('uuid')
  gameId: string;

  @ManyToOne(() => QuestionORM, (question) => question.game, {
    eager: true,
    // cascade: true,
    onDelete: 'CASCADE',
  })
  question: QuestionORM;
  @Column('uuid')
  questionId: string;

  @Column()
  questionNumber: number;

  static createGameQuestion(
    question: QuestionORM,
    questionNumber: number,
  ): GameQuestionsORM {
    const gameQuestion = new this();

    gameQuestion.question = question;
    gameQuestion.questionNumber = questionNumber;

    return gameQuestion;
  }
}
