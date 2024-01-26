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
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth-guard';

@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async likeStatus(@Param('commentId') commentId: string, @Body() dto, @Req() req: Request) {
    const accessToken = req.headers.authorization!
    const id = commentId;
    const result = await this.commentsService.likeStatus(id, accessToken, dto)

    if (!result) {
      throw new NotFoundException()
    }

    return ;
  }

  @Get(':commentId')
  async getComment(@Param('commentId') commentId: string, @Req() req: Request) {
    const accessToken = req.headers.authorization!
    const userId = await this.jwtService.verifyAsync(accessToken);
    const foundComment = await this.commentsQueryRepository.findCommentByID(commentId, userId)

    if (!foundComment) throw new NotFoundException();

    return foundComment;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async updateComment(@Param('commentId') commentId: string, @Body() dto) {
    const updatedComment = await this.commentsService.updateComment(
      commentId,
      dto,
    );

    if (!updatedComment)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteComment(@Param('commentId') commentId: string) {
    const foundComment = await this.commentsService.deleteComment(commentId);

    if (!foundComment)
      throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

    return;
  }
}
