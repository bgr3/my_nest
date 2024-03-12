import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentPutType } from '../../api/dto/input/comments-input-dto';
import { CommentsSQLRepository } from '../../infrastructure/comments-sql-repository';
// import { CommentsRepository } from '../../infrastructure/comments-repository';

export class CommentsUpdateCommentCommand {
  constructor(
    public id: string,
    public dto: CommentPutType,
  ) {}
}

@CommandHandler(CommentsUpdateCommentCommand)
export class CommentsUpdateCommentUseCase
  implements ICommandHandler<CommentsUpdateCommentCommand>
{
  constructor(
    //private readonly commentsRepository: CommentsRepository,
    private readonly commentsRepository: CommentsSQLRepository,
  ) {}

  async execute(command: CommentsUpdateCommentCommand): Promise<boolean> {
    const comment = await this.commentsRepository.getCommentById(command.id);

    if (!comment) return false;

    comment.updateComment(command.dto.content);

    await this.commentsRepository.save(comment);

    return true;
  }
}
