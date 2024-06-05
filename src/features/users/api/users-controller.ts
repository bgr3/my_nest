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
import { AuthDeleteAllAuthSessionsCommand } from '../../auth/application/use-cases/auth-delete-all-auth-sessions-use-case';
import { UsersBanUnbanCommand } from '../application/use-cases/users-ban-unban-use-case';
import { UsersCreateUserCommand } from '../application/use-cases/users-create-user-use-case';
import { UsersDeleteUserCommand } from '../application/use-cases/users-delete-user-use-case';
import { UsersORMQueryRepository } from '../infrastructure/orm/users-orm-query-repository';
import {
  UserBanDTO,
  UserPost,
  UserQueryFilter,
} from './dto/input/users-input-dto';
import { UserOutput } from './dto/output/user-output-dto';
//import { UsersQueryRepository } from '../infrastructure/users-query-repository';
// import { UsersSQLQueryRepository } from '../infrastructure/sql/users-sql-query-repository';

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    //private readonly usersQueryRepository: UsersQueryRepository,
    //private readonly usersQueryRepository: UsersSQLQueryRepository,
    private readonly usersQueryRepository: UsersORMQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Put(':userId/ban')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async banUnbanUser(
    @Body() dto: UserBanDTO,
    @Param('userId') userId: string,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new UsersBanUnbanCommand(userId, dto),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    if (dto.isBanned)
      await this.commandBus.execute(
        new AuthDeleteAllAuthSessionsCommand(userId),
      );

    return;
  }

  @Post()
  async createUser(@Body() dto: UserPost): Promise<UserOutput | null> {
    const result = await this.commandBus.execute(
      new UsersCreateUserCommand(dto, true),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const newUser = await this.usersQueryRepository.findUserByID(result);

    return newUser;
  }

  @Get()
  async getUsers(
    @Query() query: UserQueryFilter,
  ): Promise<Paginator<UserOutput>> {
    const result = await this.usersQueryRepository.findUsers(query);
    return result;
  }

  @Delete('/:id')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const foundBlog = await this.commandBus.execute(
      new UsersDeleteUserCommand(id),
    );

    if (!foundBlog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
}
