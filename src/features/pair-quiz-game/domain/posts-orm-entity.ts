import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuestionORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @Column()
  correctAnswers: string[];

  @Column({ type: 'boolean' })
  published: boolean;

  @Column({ type: 'timestamp without time zone' })
  createdAt: Date;

  @Column({ type: 'timestamp without time zone' })
  updatedAt: Date;

  updateQuestion(body: string, correctAnswers: string[]): void {
    this.body = body;
    this.correctAnswers = correctAnswers;
    this.updatedAt = new Date();
    return;
  }

  publishUnpublishQuestion(published: boolean): void {
    this.published = published;
    return;
  }

  static createQuestion(body: string, correctAnswers: string[]): QuestionORM {
    const question = new this();

    question.body = body;
    question.correctAnswers = correctAnswers;
    question.published = false;
    question.createdAt = new Date();
    question.updatedAt = new Date();

    return question;
  }
}
