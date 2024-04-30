import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { QuizAnswerGameCommand } from '../application/commands/quiz-answer-game-use-case';
import { QuizCreateGameCommand } from '../application/commands/quiz-create-game-use-case';
import { GameORMQueryRepository } from '../infrastructure/game-orm-query-repository';
import { QuizAnswerDTO, QuizParamUUIDDTO } from './dto/input/quiz-input-dto';
import { AnswersOutputDTO, GameOutputDTO } from './dto/output/game-output-dto';

@UseGuards(JwtAuthGuard)
@Controller('pair-game-quiz')
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly gameQueryRepository: GameORMQueryRepository,
  ) {}

  @Get('pairs/my-current')
  async myCurrentGame(@Req() req): Promise<GameOutputDTO> {
    const userId = req.user;

    const myGame = await this.gameQueryRepository.findGameByUserID(userId);

    if (!myGame)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return myGame;
  }

  @Get('pairs/:id')
  async getGame(@Param() dto: QuizParamUUIDDTO): Promise<GameOutputDTO> {
    const game = await this.gameQueryRepository.findGameByID(dto.id);

    if (!game)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return game;
  }

  @Post('pairs/connection')
  @HttpCode(HTTP_STATUSES.OK_200)
  async randomConnect(@Req() req): Promise<GameOutputDTO> {
    const userId = req.user;
    const result = await this.commandBus.execute(
      new QuizCreateGameCommand(userId),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const newGame = await this.gameQueryRepository.findGameByID(result);

    if (!newGame)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return newGame;
  }

  @Post('pairs/my-current/answers')
  async sendAnswer(
    @Req() req,
    @Body() dto: QuizAnswerDTO,
  ): Promise<AnswersOutputDTO> {
    const userId = req.user;

    const answer = await this.commandBus.execute(
      new QuizAnswerGameCommand(userId, dto),
    );

    if (!answer) throw new ForbiddenException();

    return answer;
  }
}
