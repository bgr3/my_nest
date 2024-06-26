import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsORMRepository } from '../../infrastructure/orm/blogs-orm-repository';
// import { BlogsSQLRepository } from '../../infrastructure/sql/blogs-sql-repository';
// import { BlogsRepository } from '../../infrastructure/blogs-repository';

export class BlogsTestAllDataCommand {
  constructor() {}
}

@CommandHandler(BlogsTestAllDataCommand)
export class BlogsTestAllDatasUseCase
  implements ICommandHandler<BlogsTestAllDataCommand>
{
  constructor(
    //protected blogsRepository: BlogsRepository
    // protected blogsRepository: BlogsSQLRepository,
    private readonly blogsRepository: BlogsORMRepository,
  ) {}

  async execute(): Promise<void> {
    const result = await this.blogsRepository.testAllData();
    return result;
  }
}
