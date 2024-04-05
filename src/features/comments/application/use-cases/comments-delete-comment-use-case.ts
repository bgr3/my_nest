import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsORMRepository } from '../../infrastructure/orm/comments-orm-repository';
// import { CommentsSQLRepository } from '../../infrastructure/sql/comments-sql-repository';
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
    // private readonly commentsRepository: CommentsSQLRepository,
    private readonly commentsRepository: CommentsORMRepository,
  ) {}

  async execute(command: CommentsDeleteCommentCommand): Promise<boolean> {
    return await this.commentsRepository.deleteComment(command.id);
  }
}
