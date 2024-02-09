import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { UsersQueryRepository } from '../infrastructure/users-query-repository';
import { userCheckQuery } from '../application/user-check-query';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { UserPost } from './dto/input/users-input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { UsersCreateUserCommand } from '../application/use-cases/users-create-user-use-case';
import { UsersDeleteUserCommand } from '../application/use-cases/users-delete-user-use-case';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() dto: UserPost) {
    const result = await this.commandBus.execute(new UsersCreateUserCommand(dto, true));

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const newUser = await this.usersQueryRepository.findUserByID(result);

    return newUser;
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async getUsers(@Query() query) {
    const queryFilter = userCheckQuery(query);

    return await this.usersQueryRepository.findUsers(queryFilter);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteUser(@Param('id') id: string) {
    const foundBlog = await this.commandBus.execute(new UsersDeleteUserCommand(id));

    if (!foundBlog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
}
