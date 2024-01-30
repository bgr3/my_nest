import { HttpException, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUSES } from '../../settings/http-statuses'
import { PostsQueryRepository } from '../../features/posts/infrastructure/posts-query-repository'
import { CommentsQueryRepository } from '../../features/comments/infrastructure/comments-query-repository'

@Injectable()
export class PostValidationMiddleware implements NestMiddleware {
    constructor(
        protected postsQueryRepository: PostsQueryRepository,
        ){}
    async use(req: Request, res: Response, next: NextFunction) {
        let post = await this.postsQueryRepository.findPostByID(req.params.postId)

        if (!post) {
            throw new HttpException('', HTTP_STATUSES.NOT_FOUND_404);
        }

        next()
        }
}

@Injectable()
export class CommentExistMiddleware implements NestMiddleware{
    constructor(
        protected commentsQueryRepository: CommentsQueryRepository,
        ){}
    async use(req: Request, res: Response, next: NextFunction) {

  const comment = await this.commentsQueryRepository.findCommentByID(req.params.id)
  
  if (comment) {
          next()
          return
      } else {
        throw new HttpException('', HTTP_STATUSES.NOT_FOUND_404);
      }
    }
}

@Injectable()
export class PostExistMiddleware implements NestMiddleware{
    constructor(
        protected postsQueryRepository: PostsQueryRepository,
        ){}
    async use(req: Request, res: Response, next: NextFunction) {
        const post = await this.postsQueryRepository.findPostByID(req.params.id)
        
        if (post) {
                next()
                return
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
    }
}