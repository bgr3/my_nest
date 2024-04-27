import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { QuizQuestionsQueryFilter } from '../api/dto/input/quiz-input-dto';
import { QuestionOutputDTO } from '../api/dto/output/quiz-output-dto';
import { QuestionORM } from '../domain/questions-orm-entity';

export class QuestionORMQueryRepository {
  constructor(
    @InjectRepository(QuestionORM)
    private readonly questionRepository: Repository<QuestionORM>,
  ) {}

  async findQuestions(
    filter: QuizQuestionsQueryFilter,
  ): Promise<Paginator<QuestionOutputDTO>> {
    const published =
      filter.publishedStatus == 'published'
        ? true
        : filter.publishedStatus == 'notPublished'
          ? false
          : null;

    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';
    const sortBy = `q.${filter.sortBy}`;

    let dbResult;
    try {
      dbResult = await this.questionRepository
        .createQueryBuilder('q')
        .select()
        .where(
          filter.publishedStatus == 'all'
            ? 'q.body ilike :body'
            : 'q.body ilike :body && q.published = :published',
          {
            body: `%${filter.bodySearchTerm}%`,
            published: published,
          },
        )
        .orderBy(sortBy, sortDirection)
        .skip(skip)
        .take(filter.pageSize)
        .getManyAndCount();
    } catch (err) {
      console.log(err);
      dbResult = [[], 0];
    }

    const dbCount = dbResult[1];

    const paginator = {
      pagesCount: Math.ceil(dbCount / filter.pageSize),
      page: filter.pageNumber,
      pageSize: filter.pageSize,
      totalCount: dbCount,
      items: dbResult[0].map((q: QuestionORM) => questionMapper(q)),
    };

    return paginator;
  }

  async findQuestionByID(id: string): Promise<QuestionOutputDTO | null> {
    let question;

    try {
      question = await this.questionRepository
        .createQueryBuilder('q')
        .select()
        .where('q.id = :id', {
          id: id,
        })
        .getOne();
    } catch (err) {
      console.log(err);
      return null;
    }

    if (!question) return null;

    return questionMapper(question);
  }
}

const questionMapper = (question: QuestionORM): QuestionOutputDTO => {
  return {
    id: question.id.toString(),
    body: question.body,
    correctAnswers: question.correctAnswers,
    published: question.published,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  };
};
