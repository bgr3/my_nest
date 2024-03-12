import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsSQLRepository } from '../../infrastructure/comments-sql-repository';
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
    private readonly commentsRepository: CommentsSQLRepository,
  ) {}

  async execute(): Promise<void> {
    return await this.commentsRepository.testAllData();
  }
}
