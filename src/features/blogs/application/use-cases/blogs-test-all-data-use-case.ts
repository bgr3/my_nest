import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsSQLRepository } from '../../infrastructure/blogs-sql-repository';
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
    protected blogsRepository: BlogsSQLRepository,
  ) {}

  async execute(): Promise<void> {
    return this.blogsRepository.testAllData();
  }
}
