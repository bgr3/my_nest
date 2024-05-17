import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { QuizAnswerGameCommand } from '../application/commands/quiz-answer-game-use-case';
import { QuizCreateGameCommand } from '../application/commands/quiz-create-game-use-case';
import { QuizCreateStatisticGameCommand } from '../application/commands/quiz-create-statistic-game-use-case';
import { AnswerDTO } from '../application/dto/game-dto';
import { GameORMQueryRepository } from '../infrastructure/game-orm-query-repository';
import { StatisticORMQueryRepository } from '../infrastructure/statistic-orm-query-repository';
import {
  QuizAnswerDTO,
  QuizGamesQueryFilter,
  QuizParamUUIDDTO,
  QuizTopGamesQueryFilter,
} from './dto/input/quiz-input-dto';
import {
  AnswersOutputDTO,
  GameOutputDTO,
  StatisticOutputDTO,
} from './dto/output/game-output-dto';

@Controller('pair-game-quiz')
export class QuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly gameQueryRepository: GameORMQueryRepository,
    private readonly statisticQueryRepository: StatisticORMQueryRepository,
  ) {}

  @Get('users/top')
  async usersTop(
    @Query() query: QuizTopGamesQueryFilter,
  ): Promise<Paginator<StatisticOutputDTO>> {
    const topGames = await this.statisticQueryRepository.findStatistics(query);

    return topGames;
  }

  @UseGuards(JwtAuthGuard)
  @Get('pairs/my')
  async myAllGames(
    @Req() req,
    @Query() query: QuizGamesQueryFilter,
    // @Param('id') id: string,
  ): Promise<Paginator<GameOutputDTO>> {
    const userId = req.user;
    // const userId = id;

    const myAllGames = await this.gameQueryRepository.findGames(query, userId);

    return myAllGames;
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/my-statistic')
  async myStatistic(
    @Req() req /*@Param('id') id: string,*/,
  ): Promise<StatisticOutputDTO> {
    const userId = req.user;
    // const userId = id;

    const statistic =
      await this.statisticQueryRepository.findStatisticByUserID(userId);

    return statistic;
  }

  @UseGuards(JwtAuthGuard)
  @Get('pairs/my-current')
  async myCurrentGame(@Req() req): Promise<GameOutputDTO> {
    const userId = req.user;

    const myGame = await this.gameQueryRepository.findGameByUserID(userId);

    if (!myGame)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return myGame;
  }

  @UseGuards(JwtAuthGuard)
  @Get('pairs/:id')
  async getGame(@Param() dto: QuizParamUUIDDTO): Promise<GameOutputDTO> {
    const game = await this.gameQueryRepository.findGameByID(dto.id);

    if (!game)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return game;
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('pairs/my-current/answers')
  @HttpCode(HTTP_STATUSES.OK_200)
  async sendAnswer(
    @Req() req,
    @Body() dto: QuizAnswerDTO,
  ): Promise<AnswersOutputDTO> {
    const userId = req.user;

    const answer: AnswerDTO = await this.commandBus.execute(
      new QuizAnswerGameCommand(userId, dto),
    );

    if (!answer) throw new ForbiddenException();

    if (answer.statusGame == 'Finished') {
      await this.commandBus.execute(
        new QuizCreateStatisticGameCommand(answer.firstPlayerId),
      );
      await this.commandBus.execute(
        new QuizCreateStatisticGameCommand(answer.secondPlayerId),
      );
    }

    return answer.answer;
  }
}
