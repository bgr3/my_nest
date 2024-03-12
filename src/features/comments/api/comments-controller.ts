import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsUpdateCommentCommand } from '../application/use-cases/comments-update-comment-use-case';
import { CommentsLikeStatusCommand } from '../application/use-cases/comments-like-status-use-case';
import { CommentsDeleteCommentCommand } from '../application/use-cases/comments-delete-comment-use-case';
import { CommentPutType } from './dto/input/comments-input-dto';
import { LikeStatus } from '../../../infrastructure/dto/input/input-dto';
import { CommentsSQLQueryRepository } from '../infrastructure/comments-sql-query-repository';
// import { CommentsQueryRepository } from '../infrastructure/comments-query-repository';

@Controller('comments')
export class CommentsController {
  constructor(
    // private readonly commentsQueryRepository: CommentsQueryRepository,
    protected commentsQueryRepository: CommentsSQLQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async likeStatus(
    @Param('commentId') commentId: string,
    @Body() dto: LikeStatus,
    @Req() req,
  ) {
    const userId = req.user;
    const id = commentId;

    const result = await this.commandBus.execute(
      new CommentsLikeStatusCommand(id, userId, dto),
    );

    if (!result) {
      throw new NotFoundException();
    }

    return;
  }

  @Get(':commentId')
  async getComment(@Param('commentId') commentId: string, @Req() req) {
    const userId = req.user;
    const foundComment = await this.commentsQueryRepository.findCommentByID(
      commentId,
      userId,
    );

    if (!foundComment) throw new NotFoundException();

    return foundComment;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: CommentPutType,
  ) {
    const updatedComment = await this.commandBus.execute(
      new CommentsUpdateCommentCommand(commentId, dto),
    );

    if (!updatedComment)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async deleteComment(@Param('commentId') commentId: string) {
    const foundComment = await this.commandBus.execute(
      new CommentsDeleteCommentCommand(commentId),
    );

    if (!foundComment)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }
}
