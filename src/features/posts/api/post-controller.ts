
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Res } from "@nestjs/common";
import { PostsService } from "../application/post-service"
import { PostsQueryRepository } from "../infrastructure/posts-query-repository"
import { PostPostType, PostPutType } from "./dto/input/post-input-dto";
import { HTTP_STATUSES } from "src/http-statuses";
import { CommentPostType } from "src/features/comments/api/dto/input/comments-input-dto";
import { CommentsService } from "src/features/comments/application/comment-service";
import { CommentsQueryRepository } from "src/features/comments/infrastructure/comments-query-repository";

@Controller('posts')
export class PostsController {
    constructor(
        //protected authorizationValidation: AuthorizationValidation,
        protected postsService: PostsService,
        protected commentsService: CommentsService,
        protected commentsQueryRepository: CommentsQueryRepository,
        protected postsQueryRepository: PostsQueryRepository
    ){}

    // async likeStatus(req: Request, res: Response) {
    //   const token = req.headers.authorization!  
    //   const id = req.params.id
    //   const body = req.body
    //   const result = await this.postsService.likeStatus(id, token, body)     
      
    //   if (!result) {
    //     res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //     return
    //   }

    //   res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    // }

    @Post()
    async createPost(@Body() dto: PostPostType, @Res() res) {
    
      let result = await this.postsService.createPost(dto)
      
      if (!result) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400);
        return
      } 
  
      const newPost = await this.postsQueryRepository.findPostByID(result)
        
      return newPost;
    }

    @Post(':postId/comments')
    async createCommentForPost(@Param('postId') postId: string, @Body() dto: CommentPostType, @Res() res) {
      //const token = req.headers.authorization!
      const result = await this.commentsService.createComment(dto,/* token,*/ postId)
        if (!result) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400);
        return
      } 
  
      const newPost = await this.commentsQueryRepository.findCommentByID(result)
        
      return newPost;
    }

    @Get()
    async getPosts(@Query() query, @Res() res) {  
      //const queryFilter = postCheckQuery(query)

      //const accessToken = req.headers.authorization
    //   let userId = ''
    //   if(accessToken){
    //     const user = await this.authorizationValidation.getUserByJWTAccessToken(accessToken)  
    //     if(user) {
    //       userId = user._id.toString()
    //     }
    //   }
      
        const userId = ''

        return await this.postsQueryRepository.findPosts(null, query, userId);
    }

    @Get(':postId')
    async getPost(@Param('postId') postId: string, @Res() res) {
    //   const accessToken = req.headers.authorization
    //   let userId = ''
    //   if(accessToken){
    //     const user = await this.authorizationValidation.getUserByJWTAccessToken(accessToken)  
    //     if(user) {
    //       userId = user!._id.toString()
    //     }
    //   }
        const userId = ''

        const foundPost = await this.postsQueryRepository.findPostByID(postId, userId)
        
        if (foundPost) {      
            return foundPost;
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    @Get(':postId/comments')
    async getCommentsForPost(@Param('postId') postId: string, @Query() query, @Res() res) {     
        //const queryFilter = postCheckQuery(req.query)
        const post = await this.postsQueryRepository.findPostByID(postId)

        // const accessToken = req.headers.authorization
        // let userId = ''
        // if(accessToken){
        //     const user = await this.authorizationValidation.getUserByJWTAccessToken(accessToken)  
        //     if(user) {
        //     userId = user!._id.toString()
        //     }
        // }
        
        const userId = ''

        const foundcomments = await this.commentsQueryRepository.findComments(postId, query, userId)
        
        if (post) {      
            return foundcomments;
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    @Put(':postId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updatePost(@Param('postId') postId: string, @Body() dto: PostPutType, @Res() res){
    
        const updatedPost = await this.postsService.updatePost(postId, dto);
        
        if (!updatedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return ;
        }
    
        return ;
    }
    
    @Delete(':postId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deletePost(@Param('postId') postId: string, @Res() res) {
    
        const foundPost = await this.postsService.deletePost(postId)
        
        if (foundPost) {
            return ;
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return ;
        }
        }
  }