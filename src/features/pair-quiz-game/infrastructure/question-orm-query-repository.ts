import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryFilter } from '../../../infrastructure/dto/input/input-dto';
import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { QuestionOutputDTO } from '../api/dto/output/quiz-output-dto';
import { QuestionORM } from '../domain/posts-orm-entity';

export class QuestionORMQueryRepository {
  constructor(
    @InjectRepository(QuestionORM)
    private readonly questionRepository: Repository<QuestionORM>,
  ) {}

  async findQuestions(
    filter: QueryFilter,
  ): Promise<Paginator<QuestionOutputDTO>> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;

    const sortDirection = filter.sortDirection == 'asc' ? 'ASC' : 'DESC';

    let dbResult;
    try {
      dbResult = await this.questionRepository
        .createQueryBuilder('q')
        .select()
        .orderBy(filter.sortBy, sortDirection)
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
      items: dbResult[0].map((q: QuestionORM) => postMapper(q)),
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

    return postMapper(question);
  }
}

const postMapper = (question: QuestionORM): QuestionOutputDTO => {
  return {
    id: question.id.toString(),
    body: question.body,
    correctAnswers: question.correctAnswers,
    published: question.published,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  };
};
