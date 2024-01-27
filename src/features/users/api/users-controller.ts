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
import { UsersService } from '../application/users-service';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { UsersQueryRepository } from '../infrastructure/users-query-repository';
import { userCheckQuery } from '../application/user-check-query';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic-auth-guard';
import { UserPost } from './dto/input/users-input-dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() dto: UserPost) {
    const result = await this.usersService.createUser(dto, true);

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
    const foundBlog = await this.usersService.deleteUser(id);

    if (!foundBlog)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
}
