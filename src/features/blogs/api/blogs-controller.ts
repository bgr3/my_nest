import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Res } from "@nestjs/common";
import { BlogPostType, BlogPutType, PostForBlogPostType } from "./dto/input/blogs-input-dto";
import { BlogsService } from "../application/blog-service";
import { BlogsQueryRepository } from "../infrastructure/blogs-query-repository";
import { HTTP_STATUSES } from "../../../settings/http-statuses";
import { PostsQueryRepository } from "../../posts/infrastructure/posts-query-repository";
import { PostsService } from "../../posts/application/post-service";

@Controller('blogs')
export class BlogsController {
    constructor(
        //private readonly authorizationValidation: AuthorizationValidation,
        private readonly blogsService: BlogsService,
        private readonly blogsQueryRepository: BlogsQueryRepository,
        private readonly postsService: PostsService,
        private readonly postsQueryRepository: PostsQueryRepository
    ){}

    @Post()
    async createBlog(@Body() dto: BlogPostType) {
    
      let result = await this.blogsService.createBlog(dto)

      if (!result) {
        //res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        throw new Error('404')
        return
      }

      const newBlog = await this.blogsQueryRepository.findBlogByID(result!)

      return newBlog;
    }

    @Post(':id/posts')
    async createPostforBlog(@Param('id') id: string, @Body() dto: PostForBlogPostType) {
      dto.blogId = id
      
      let result = await this.postsService.createPost(dto)
      
      if (!result) {
        //res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
      } 
      
      const newPost = await this.postsQueryRepository.findPostByID(result)
        
      return newPost;
    }

    @Get()
    async getBlogs(@Query() query) {
        //const queryFilter = blogCheckQuery(query)
      
        return await this.blogsQueryRepository.findBlogs(query);
    }

    @Get(':id')
    async getBlog(@Param('id') id: string) {
    
      const foundBlog = await this.blogsQueryRepository.findBlogByID(id)
    
      if (foundBlog) {      
        return foundBlog;
      } //else {
      //   res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      //   return
      // }
    }

    @Get(':id/posts')
    async getPostsforBlog(@Param('id') id: string, @Query() query) {
      const foundBlog = await this.blogsQueryRepository.findBlogByID(id)
      //const queryFilter = postCheckQuery(query)

      //const accessToken = req.headers.authorization
    //   let userId = ''
    //   if(accessToken){
    //     const user = await this.authorizationValidation.getUserByJWTAccessToken(accessToken)  
    //     if(user) {
    //       userId = user._id.toString()
    //     }
    //   }
      
      const posts = await this.postsQueryRepository.findPosts(id, query/*, userId*/)
    
      if (!foundBlog) {
        //res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      } else {
        return posts;
      } 
    }

    @Put(':id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async updateBlog(@Param('id') id: string, @Body() dto: BlogPutType) {
    
      const foundBlog = await this.blogsQueryRepository.findBlogByID(id)
      if (foundBlog) {
        const updatedBlog = await this.blogsService.updateBlog(id, dto) 
        
        if (updatedBlog) {
          return
        } else {
          //res.status(HTTP_STATUSES.BAD_REQUEST_400);
          return
        }
      } else {
        //res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
      }
    }

    @Delete(':id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteBlog(@Param('id') id: string) {
      const foundBlog = await this.blogsService.deleteBlog(id)
    
      if (foundBlog) {
        return
      } else {
        //res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
      }
    }
  }