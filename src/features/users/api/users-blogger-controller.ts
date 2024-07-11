import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Paginator } from '../../../infrastructure/dto/output/output-dto';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { BlogsORMQueryRepository } from '../../blogs/infrastructure/orm/blogs-orm-query-repository';
import { UsersBloggerBanUnbanCommand } from '../application/use-cases/users-blogger-ban-unban-use-case';
import { UsersORMQueryRepository } from '../infrastructure/orm/users-orm-query-repository';
import { UserBlogBanDTO, UserQueryFilter } from './dto/input/users-input-dto';
import { UserBloggerOutput } from './dto/output/user-output-dto';

@Controller('blogger/users')
@UseGuards(JwtAuthGuard)
export class UsersBloggerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersORMQueryRepository,
    private readonly blogsQueryRepository: BlogsORMQueryRepository,
  ) {}

  @Put(':userId/ban')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async banUnbanUser(
    @Body() dto: UserBlogBanDTO,
    @Param('userId') userId: string,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new UsersBloggerBanUnbanCommand(userId, dto),
    );

    if (!result)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @Get('blog/:blogId')
  async getUsers(
    @Query() query: UserQueryFilter,
    @Param('blogId') blogId: string,
  ): Promise<Paginator<UserBloggerOutput>> {
    const blog = await this.blogsQueryRepository.findBlogByID(blogId);

    if (!blog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    const result = await this.usersQueryRepository.findBlogBannedUsers(
      query,
      blogId,
    );
    return result;
  }
}
