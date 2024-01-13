import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../infrastructure/posts-repository";
import { Post, PostModelType } from "../domain/posts-entity";
import { InjectModel } from "@nestjs/mongoose";
import { PostPostType, PostPutType } from "../api/dto/input/post-input-dto";
import { BlogsQueryRepository } from "../../blogs/infrastructure/blogs-query-repository";

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType,
        //protected authorizationValidation: AuthorizationValidation,
        protected postsRepository: PostsRepository,
        protected blogsQueryRepository: BlogsQueryRepository){}
    async testAllData (): Promise<void> {
        return await this.postsRepository.testAllData()
    }

    async createPost (dto: PostPostType): Promise<string | null> {
        
        const blogName = (await this.blogsQueryRepository.findBlogByID(dto.blogId.trim()))?.name
        
        if (blogName){
            const newPost = Post.createPost(dto.title, dto.shortDescription, dto.content, dto.blogId, blogName)

            const newPostModel = new this.PostModel(newPost)
        
            await this.postsRepository.save(newPostModel);
        
            return newPostModel._id.toString()
        }

        return null  

    }

    async updatePost (id: string, dto: PostPutType): Promise<boolean> {
        
        const blogName = (await this.blogsQueryRepository.findBlogByID(dto.blogId.trim()))?.name

        const post = await this.postsRepository.getPostById(id)
        
        if (!post || !blogName) return false

        post.updatePost(dto.title, dto.shortDescription, dto.content, dto.blogId, blogName)

        return true
    } 

    // async likeStatus (commentId: string, accessToken: string, body: PostLikeStatus): Promise <boolean> {
    //     const user = await this.authorizationValidation.getUserByJWTAccessToken(accessToken)
    //     const userId = user!._id.toString()
    //     const login = user!.login
    //     const likeStatus = body.likeStatus
    //     return await this.postsRepository.setLikeStatus(commentId, userId, login, likeStatus)
    // }

    async deletePost (id: string): Promise<boolean> {
        return this.postsRepository.deletePost(id)
    }
}


