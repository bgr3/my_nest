import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments-repository';

export class CommentsDeleteCommentCommand {
  constructor(public id: string) {}
}

@CommandHandler(CommentsDeleteCommentCommand)
export class CommentsDeleteCommentUseCase
implements ICommandHandler<CommentsDeleteCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: CommentsDeleteCommentCommand): Promise<boolean> {
    return await this.commentsRepository.deleteComment(command.id);
  }
}
