/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { CommentsORMQueryRepository } from '../../features/comments/infrastructure/orm/comments-orm-query-repository';
// import { PostsSQLQueryRepository } from '../../features/posts/infrastructure/sql/posts-sql-query-repository';
// import { CommentsSQLQueryRepository } from '../../features/comments/infrastructure/sql/comments-sql-query-repository';
import { PostsORMQueryRepository } from '../../features/posts/infrastructure/orm/posts-orm-query-repository';
import { UsersService } from '../../features/users/application/users-service';
import { HTTP_STATUSES } from '../../settings/http-statuses';
// import { CommentsQueryRepository } from '../../features/comments/infrastructure/comments-query-repository';
// import { PostsQueryRepository } from '../../features/posts/infrastructure/posts-query-repository';

@Injectable()
export class PostValidationMiddleware implements NestMiddleware {
  constructor(
    // protected postsQueryRepository: PostsQueryRepository
    // protected postsQueryRepository: PostsSQLQueryRepository,
    protected postsQueryRepository: PostsORMQueryRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const post = await this.postsQueryRepository.findPostByID(req.params['0']);

    if (!post) {
      throw new HttpException('', HTTP_STATUSES.NOT_FOUND_404);
    }

    next();
  }
}

@Injectable()
export class CommentExistMiddleware implements NestMiddleware {
  constructor(
    // protected commentsQueryRepository: CommentsQueryRepository
    // protected commentsQueryRepository: CommentsSQLQueryRepository,
    protected commentsQueryRepository: CommentsORMQueryRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const comment = await this.commentsQueryRepository.findCommentByID(
      req.params[0],
    );

    if (comment) {
      next();
      return;
    } else {
      throw new HttpException('', HTTP_STATUSES.NOT_FOUND_404);
    }
  }
}

@Injectable()
export class PostExistMiddleware implements NestMiddleware {
  constructor(
    // protected postsQueryRepository: PostsQueryRepository
    // protected postsQueryRepository: PostsSQLQueryRepository,
    protected postsQueryRepository: PostsORMQueryRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const post = await this.postsQueryRepository.findPostByID(req.params[0]);

    if (post) {
      next();
      return;
    } else {
      throw new HttpException('', HTTP_STATUSES.NOT_FOUND_404);
    }
  }
}

@Injectable()
export class AuthorizationCommentMiddleware implements NestMiddleware {
  constructor(protected commentsQueryRepository: CommentsORMQueryRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const comment = await this.commentsQueryRepository.findCommentByID(
      req.params[0].split('/')[0],
    );
    const userId = req.user;

    //if (!comment) throw new HttpException('', HTTP_STATUSES.NOT_FOUND_404);

    if (comment && userId) {
      if (comment.commentatorInfo.userId === userId) {
        next();
        return;
      } else {
        throw new HttpException('', HTTP_STATUSES.FORBIDDEN_403);
      }
    }

    next();
  }
}

@Injectable()
export class BannedUserCommentMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    protected postsQueryRepository: PostsORMQueryRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const post = await this.postsQueryRepository.findPostByID(
      req.params[0].split('/')[0],
    );
    const userId = req.user?.toString();

    if (post && userId) {
      const user = await this.usersService.findUserDbByID(userId);

      if (user) {
        if (!user.blogBanInfo.find((i) => i.blog.id === post.blogId)) {
          next();
          return;
        } else {
          throw new HttpException('', HTTP_STATUSES.FORBIDDEN_403);
        }
      }
    }

    next();
  }
}
