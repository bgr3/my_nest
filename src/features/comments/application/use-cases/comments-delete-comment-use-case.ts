import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsSQLRepository } from '../../infrastructure/comments-sql-repository';
// import { CommentsRepository } from '../../infrastructure/comments-repository';

export class CommentsDeleteCommentCommand {
  constructor(public id: string) {}
}

@CommandHandler(CommentsDeleteCommentCommand)
export class CommentsDeleteCommentUseCase
  implements ICommandHandler<CommentsDeleteCommentCommand>
{
  constructor(
    // private readonly commentsRepository: CommentsRepository
    private readonly commentsRepository: CommentsSQLRepository,
  ) {}

  async execute(command: CommentsDeleteCommentCommand): Promise<boolean> {
    return await this.commentsRepository.deleteComment(command.id);
  }
}
