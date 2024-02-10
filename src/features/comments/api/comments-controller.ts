import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comment-service';
import { CommentsQueryRepository } from '../infrastructure/comments-query-repository';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsUpdateCommentCommand } from '../application/use-cases/comments-update-comment-use-case';
import { CommentsLikeStatusCommand } from '../application/use-cases/comments-like-status-use-case';
import { CommentsDeleteCommentCommand } from '../application/use-cases/comments-delete-comment-use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected jwtService: JwtService,
    private readonly commandBus: CommandBus,

  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async likeStatus(@Param('commentId') commentId: string, @Body() dto, @Req() req) {
    const userId = req.user
    const id = commentId;

    const result = await this.commandBus.execute(new CommentsLikeStatusCommand(id, userId, dto));

    if (!result) {
      throw new NotFoundException()
    }

    return ;
  }

  @Get(':commentId')
  async getComment(@Param('commentId') commentId: string, @Req() req) {
    const userId = req.user
    const foundComment = await this.commentsQueryRepository.findCommentByID(commentId, userId)

    if (!foundComment) throw new NotFoundException();

    return foundComment;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updateComment(@Param('commentId') commentId: string, @Body() dto) {
    const updatedComment = await this.commandBus.execute(new CommentsUpdateCommentCommand(
      commentId,
      dto,
    ));

    if (!updatedComment)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteComment(@Param('commentId') commentId: string) {
    const foundComment = await this.commandBus.execute(new CommentsDeleteCommentCommand(commentId));

    if (!foundComment)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }
}
