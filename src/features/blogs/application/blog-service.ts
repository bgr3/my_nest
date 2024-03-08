import { Injectable } from '@nestjs/common';
import { BlogsSQLRepository } from '../infrastructure/blogs-sql-repository';
// import { BlogsRepository } from '../infrastructure/blogs-repository';

@Injectable()
export class BlogsService {
  constructor(
    //protected blogsRepository: BlogsRepository
    protected blogsRepository: BlogsSQLRepository,
  ) {}
}
