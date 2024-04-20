import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { BlogsORMRepository } from '../../../../blogs/infrastructure/orm/blogs-orm-repository';
// import { BlogsSQLRepository } from '../../../../blogs/infrastructure/sql/blogs-sql-repository';
//import { BlogsRepository } from '../../../../blogs/infrastructure/blogs-repository';

@ValidatorConstraint({ name: 'customText', async: true })
@Injectable()
export class BlogExistValidation implements ValidatorConstraintInterface {
  constructor(
    //private readonly blogsRepository: BlogsRepository
    // private readonly blogsRepository: BlogsSQLRepository,
    private readonly blogsRepository: BlogsORMRepository,
  ) {}

  errorMessage: string;

  async validate(blogId: string) {
    const blog = await this.blogsRepository.getBlogById(blogId);

    if (!blog) {
      this.errorMessage = 'blog doesn`t exist';
      return false;
    }

    return true;
  }

  defaultMessage() {
    return this.errorMessage;
  }
}
