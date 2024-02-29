import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments-repository';

export class CommentsTestAllDataCommand {
  constructor() {}
}

@CommandHandler(CommentsTestAllDataCommand)
export class CommentsTestAllDataUseCase
implements ICommandHandler<CommentsTestAllDataCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(): Promise<void> {
    return await this.commentsRepository.testAllData();
  }
}
