import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { QuizCreateQuestionCommand } from '../application/commands/quiz-create-question-use-case';
import { QuizDeleteQuestionCommand } from '../application/commands/quiz-delete-question-use-case';
import { QuizPublishUnpublishQuestionCommand } from '../application/commands/quiz-publish-question-use-case';
import { QuizUpdateQuestionCommand } from '../application/commands/quiz-update-question-use-case';
import { QuestionORMQueryRepository } from '../infrastructure/question-orm-query-repository';
import {
  QuizPostQuestionDTO,
  QuizPublishDTO,
  QuizQuestionsQueryFilter,
} from './dto/input/quiz-input-dto';
import { QuestionOutputDTO } from './dto/output/quiz-output-dto';

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz')
export class QuizSAController {
  constructor(
    private readonly questionQueryRepository: QuestionORMQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('questions')
  async getQuestions(
    @Query() query: QuizQuestionsQueryFilter,
  ): Promise<Paginator<QuestionOutputDTO>> {
    const result = await this.questionQueryRepository.findQuestions(query);

    return result;
  }

  @Post('questions')
  async createQuestion(
    @Body() dto: QuizPostQuestionDTO,
  ): Promise<QuestionOutputDTO | null> {
    const result = await this.commandBus.execute(
      new QuizCreateQuestionCommand(dto),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const newQusestion =
      await this.questionQueryRepository.findQuestionByID(result);

    return newQusestion;
  }

  @Delete('questions/:id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteQuestion(@Param('id') id: string): Promise<void> {
    const result = await this.commandBus.execute(
      new QuizDeleteQuestionCommand(id),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;

    return;
  }

  @Put('questions/:id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updateQuestion(
    @Param('id') id: string,
    @Body() dto: QuizPostQuestionDTO,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new QuizUpdateQuestionCommand(id, dto),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @Put('questions/:id/publish')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async publishUnpublishQuestion(
    @Param('id') id: string,
    @Body() dto: QuizPublishDTO,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new QuizPublishUnpublishQuestionCommand(id, dto),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }
}
