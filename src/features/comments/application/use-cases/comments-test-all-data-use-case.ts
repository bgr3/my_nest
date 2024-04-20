import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsORMRepository } from '../../infrastructure/orm/comments-orm-repository';
// import { CommentsSQLRepository } from '../../infrastructure/sql/comments-sql-repository';
// import { CommentsRepository } from '../../infrastructure/comments-repository';

export class CommentsTestAllDataCommand {
  constructor() {}
}

@CommandHandler(CommentsTestAllDataCommand)
export class CommentsTestAllDataUseCase
  implements ICommandHandler<CommentsTestAllDataCommand>
{
  constructor(
    // private readonly commentsRepository: CommentsRepository
    // private readonly commentsRepository: CommentsSQLRepository,
    private readonly commentsRepository: CommentsORMRepository,
  ) {}

  async execute(): Promise<void> {
    return await this.commentsRepository.testAllData();
  }
}
