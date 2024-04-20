import { Controller, Get, Param, Post } from '@nestjs/common';
@Controller('pair-game-quiz')
export class QuizController {
  constructor() {}

  @Get('pairs/my-current')
  async myCurrentGame(params: string): Promise<string> {
    console.log('1');
    return params;
  }

  @Get('pairs/my-current/:id')
  async getGame(@Param('id') id: string): Promise<string> {
    return id;
  }

  @Post('pairs/connection')
  async randomConnect(): Promise<string> {
    return '3';
  }

  @Post('pairs/my-current/answers')
  async sendAnswer(): Promise<string> {
    return '4';
  }
}
