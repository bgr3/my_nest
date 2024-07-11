import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { BlogsORMRepository } from '../../features/blogs/infrastructure/orm/blogs-orm-repository';
import { HTTP_STATUSES } from '../../settings/http-statuses';

@Injectable()
export class AuthorizationBlogMiddleware implements NestMiddleware {
  constructor(private readonly blogsRepository: BlogsORMRepository) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const blog = await this.blogsRepository.getBlogById(
      req.params[0].split('/')[0],
    );
    const userId = req.user;
    // console.log(req.params[0].split('/')[0]);

    if (blog && userId) {
      if (blog.blogOwnerInfo.id === userId) {
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
export class AuthorizationBloggerBanMiddleware implements NestMiddleware {
  constructor(private readonly blogsRepository: BlogsORMRepository) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const blog = await this.blogsRepository.getBlogById(req.body.blogId);
    const userId = req.user;

    if (blog && userId) {
      if (blog.blogOwnerInfo.id === userId) {
        next();
        return;
      } else {
        throw new HttpException('', HTTP_STATUSES.FORBIDDEN_403);
      }
    }

    next();
  }
}
