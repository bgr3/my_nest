
import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, Post, Put, Query, Res } from "@nestjs/common";
import { PostsService } from "../application/post-service"
import { PostsQueryRepository } from "../infrastructure/posts-query-repository"
import { PostPostType, PostPutType } from "./dto/input/post-input-dto";
import { HTTP_STATUSES } from "../../../settings/http-statuses";
import { CommentPostType } from "../../comments/api/dto/input/comments-input-dto";
import { CommentsService } from "../../comments/application/comment-service";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments-query-repository";


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
    async createPost(@Body() dto: PostPostType) {
    
      let result = await this.postsService.createPost(dto)
      
      if (!result) throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
  
      const newPost = await this.postsQueryRepository.findPostByID(result)
        
      return newPost;
    }

    @Post(':postId/comments')
    async createCommentForPost(@Param('postId') postId: string, @Body() dto: CommentPostType) {
      //const token = req.headers.authorization!
      const result = await this.commentsService.createComment(dto,/* token,*/ postId)
        if (!result) throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
  
      const newPost = await this.commentsQueryRepository.findCommentByID(result)
        
      return newPost;
    }

    @Get()
    async getPosts(@Query() query) {  
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
    async getPost(@Param('postId') postId: string) {
    //   const accessToken = req.headers.authorization
    //   let userId = ''
    //   if(accessToken){
    //     const user = await this.authorizationValidation.getUserByJWTAccessToken(accessToken)  
    //     if(user) {
    //       userId = user!._id.toString()
    //     }
    //   }
        const userId = ''
        console.log('1');

        const foundPost = await this.postsQueryRepository.findPostByID(postId, userId)
        console.log(foundPost);
        
        if (!foundPost) throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);

        return foundPost;
    }

    @Get(':postId/comments')
    async getCommentsForPost(@Param('postId') postId: string, @Query() query) {     
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
        
        if (!post) throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);      
        
        return foundcomments;
    }

    @Put(':postId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updatePost(@Param('postId') postId: string, @Body() dto: PostPutType){
    
        const updatedPost = await this.postsService.updatePost(postId, dto);
        
        if (!updatedPost) throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
    
        return ;
    }
    
    @Delete(':postId')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deletePost(@Param('postId') postId: string) {
    
        const foundPost = await this.postsService.deletePost(postId)
        
        if (!foundPost) throw new HttpException('NOT_FOUND', HTTP_STATUSES.NOT_FOUND_404);
            
        return ;
    }
  }