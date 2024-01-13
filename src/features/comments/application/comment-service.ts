import { Injectable } from "@nestjs/common";
import { CommentForPost, CommentModelType } from "../domain/comments-entity";
import { InjectModel } from "@nestjs/mongoose";
import { CommentsRepository } from "../infrastructure/comments-reppository";
import { CommentPostType, CommentPutType } from "../api/dto/input/comments-input-dto";
import { PostsQueryRepository } from "../../posts/infrastructure/posts-query-repository";
import { PostsRepository } from "../../posts/infrastructure/posts-repository";

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(CommentForPost.name) private CommentModel: CommentModelType,
        //protected authorizationValidation: AuthorizationValidation,
        protected commentsRepository: CommentsRepository,
        protected postsRepository: PostsRepository,
        protected postsQueryRepository: PostsQueryRepository){}

    async testAllData (): Promise<void> {
        return await this.commentsRepository.testAllData()
    }

    async createComment (dto: CommentPostType, /*token: string,*/ postId: string): Promise</*Result<string | null>*/string | null> {
        //const user = await this.authorizationValidation.getUserByJWTAccessToken(token)

        //if (!user) return null

        
        const post = await this.postsQueryRepository.findPostByID(postId)
        
        if (post){
            const newComment = CommentForPost.createComment(
                dto.content, 
                post.id, 
                '1', //user._id.toString(),
                'a', //user.login
            );
        
        
            const newCommentModel = new this.CommentModel(newComment)
        
            await this.commentsRepository.save(newCommentModel);
        
            return newCommentModel._id.toString()
        }

        return null  

    }

    async updateComment (id: string, dto: CommentPutType): Promise<boolean> {
        const comment = await this.commentsRepository.getCommentById(id)

        if (!comment) return false
        
        comment.updateComment(
            dto.content
        )    

        return true
    }

    // async likeStatus (commentId: string, accessToken: string, body: CommentLikeStatus): Promise <boolean> {
    //     const user = await this.authorizationValidation.getUserByJWTAccessToken(accessToken)
    //     const userId = user!._id.toString()
    //     const likeStatus = body.likeStatus
    //     const myLikeStatus = await this.commentsRepository.myLikeStatus(commentId, userId)
        
    //     if (!myLikeStatus) return false        

    //     if (likeStatus !== myLikeStatus) {
    //         return await this.commentsRepository.setLikeStatus(commentId, userId, myLikeStatus, likeStatus)
    //     }

    //     return true
    // }

    async deleteComment (id: string): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }
}

