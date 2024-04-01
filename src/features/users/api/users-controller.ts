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
//import { UsersQueryRepository } from '../infrastructure/users-query-repository';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { UserPost, UserQueryFilter } from './dto/input/users-input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { UsersCreateUserCommand } from '../application/use-cases/users-create-user-use-case';
import { UsersDeleteUserCommand } from '../application/use-cases/users-delete-user-use-case';
import { UsersSQLQueryRepository } from '../infrastructure/sql/users-sql-query-repository';
import { UsersORMQueryRepository } from '../infrastructure/orm/users-orm-query-repository';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    //private readonly usersQueryRepository: UsersQueryRepository,
    //private readonly usersQueryRepository: UsersSQLQueryRepository,
    private readonly usersQueryRepository: UsersORMQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async createUser(@Body() dto: UserPost) {
    const result = await this.commandBus.execute(
      new UsersCreateUserCommand(dto, true),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const newUser = await this.usersQueryRepository.findUserByID(result);

    return newUser;
  }

  @Get()
  async getUsers(@Query() query: UserQueryFilter) {
    return await this.usersQueryRepository.findUsers(query);
  }

  @Delete('/:id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteUser(@Param('id') id: string) {
    const foundBlog = await this.commandBus.execute(
      new UsersDeleteUserCommand(id),
    );

    if (!foundBlog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
}
