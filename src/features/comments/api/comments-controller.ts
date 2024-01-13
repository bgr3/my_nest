import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Res } from "@nestjs/common";
import { HTTP_STATUSES } from "src/settings/http-statuses";
import { CommentsService } from "../application/comment-service";
import { CommentsQueryRepository } from "../infrastructure/comments-query-repository";

@Controller('comments')
export class CommentsController {
    constructor(
      //protected authorizationValidation: AuthorizationValidation,
      protected commentsService: CommentsService,
      protected commentsQueryRepository: CommentsQueryRepository){}

    // @Get('commentId')
    // @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    // async likeStatus(@Param('commentId') commentId: string, @Body() dto, @Res() res) {
    //   const token = req.headers.authorization!  
    //   const id = commentId;
    //   const body = dto;
    //   const result = await this.commentsService.likeStatus(id, token, body)     
      
    //   if (!result) {
    //     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //     return
    //   }

    //   return ;
    // }

    // @Get()
    // async getComment(@Param('commentId') commentId: string, @Res() res) {
    //   const accessToken = req.headers.authorization
    //   let userId = ''
    //   if(accessToken){
    //     const user = await this.authorizationValidation.getUserByJWTAccessToken(accessToken)  
    //     if(user) {
    //       userId = user!._id.toString()
    //     }
    //   }
      
    //   const foundComment = await this.commentsQueryRepository.findCommentByID(req.params.id, userId)
      
    //   if (foundComment) {      
    //     return foundComment;
    //   } else {
    //     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    //     return ;
    //   }
    // }

    @Put()
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateComment(@Param('commentId') commentId: string, @Body() dto, @Res() res) {
  
        const updatedComment = await this.commentsService.updateComment(commentId, dto) 
        
        if (!updatedComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return
        }
        
        return ;
    }

    @Delete()
    async deleteComment(@Param('commentId') commentId: string, @Res() res) {
    
        const foundComment = await this.commentsService.deleteComment(commentId)
        
        if (!foundComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return ;
        }
        
        return
    }
  }