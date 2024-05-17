import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { GameQuestionsORM } from './game-qusestions-orm-entity';

@Entity()
export class QuestionORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @Column({
    type: 'character varying',
    array: true,
  })
  correctAnswers: string[];

  @Column({ type: 'boolean' })
  published: boolean;

  @Column({ type: 'timestamp without time zone' })
  createdAt: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  updatedAt: Date;

  @OneToMany(() => GameQuestionsORM, (gameQuestions) => gameQuestions.question)
  game: GameQuestionsORM[];

  updateQuestion(body: string, correctAnswers: string[]): void {
    this.body = body;
    this.correctAnswers = correctAnswers;
    this.updatedAt = new Date();
    return;
  }

  publishUnpublishQuestion(published: boolean): void {
    this.published = published;
    this.updatedAt = new Date();
    return;
  }

  static createQuestion(body: string, correctAnswers: string[]): QuestionORM {
    const question = new this();

    question.body = body;
    question.correctAnswers = correctAnswers;
    question.published = false;
    question.createdAt = new Date();

    return question;
  }
}
