import { Injectable } from '@nestjs/common';

import { BlogsORMRepository } from '../infrastructure/orm/blogs-orm-repository';
// import { BlogsSQLRepository } from '../infrastructure/sql/blogs-sql-repository';
// import { BlogsRepository } from '../infrastructure/blogs-repository';

@Injectable()
export class BlogsService {
  constructor(
    //protected blogsRepository: BlogsRepository
    // protected blogsRepository: BlogsSQLRepository,
    private readonly blogsRepository: BlogsORMRepository,
  ) {}
}
