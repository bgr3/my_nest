import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuestionORM } from '../domain/questions-orm-entity';

export class QuestionORMRepository {
  constructor(
    @InjectRepository(QuestionORM)
    private readonly questionRepository: Repository<QuestionORM>,
  ) {}

  async testAllData(): Promise<void> {
    await this.questionRepository.delete({});
  }

  async save(question: QuestionORM): Promise<string | null> {
    const questionResult = await this.questionRepository.save(question);

    return questionResult.id;
  }

  async getQuestionById(id: string): Promise<QuestionORM | null> {
    let question;

    try {
      question = await this.questionRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);

      return null;
    }

    return question;
  }

  async getAllPublishedQuestions(): Promise<[QuestionORM[], number]> {
    let questions;

    try {
      questions = await this.questionRepository.findAndCount({
        where: {
          published: true,
        },
      });
    } catch (err) {
      console.log(err);

      return [[], 0];
    }

    return questions;
  }

  async getFivePublishedRandomQuestions(): Promise<QuestionORM[]> {
    let questions;

    try {
      questions = await this.questionRepository
        .createQueryBuilder('q')
        .select()
        .where('q.published = :published', { published: true })
        .orderBy('RANDOM()')
        .take(5)
        .getMany();
    } catch (err) {
      console.log(err);

      return [];
    }

    return questions;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    let result;

    try {
      result = await this.questionRepository.delete(id);
    } catch (err) {
      console.log(err);

      return false;
    }

    if (result.affected === 0) return false;

    return true;
  }
}
