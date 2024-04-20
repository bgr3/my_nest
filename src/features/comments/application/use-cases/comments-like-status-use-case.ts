import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LikeStatus } from '../../../../infrastructure/dto/input/input-dto';
import { UsersService } from '../../../users/application/users-service';
import { CommentsORMRepository } from '../../infrastructure/orm/comments-orm-repository';
// import { CommentsSQLRepository } from '../../infrastructure/sql/comments-sql-repository';
// import { CommentsRepository } from '../../infrastructure/comments-repository';

export class CommentsLikeStatusCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public dto: LikeStatus,
  ) {}
}

@CommandHandler(CommentsLikeStatusCommand)
export class CommentsLikeStatusUseCase
  implements ICommandHandler<CommentsLikeStatusCommand>
{
  constructor(
    // private readonly commentsRepository: CommentsRepository,
    // private readonly commentsRepository: CommentsSQLRepository,
    private readonly commentsRepository: CommentsORMRepository,
    private readonly usersService: UsersService,
  ) {}

  async execute(command: CommentsLikeStatusCommand): Promise<boolean> {
    const user = await this.usersService.findUserDbByID(command.userId);

    if (!user) return false;

    const login = user.login;
    const likeStatus = command.dto.likeStatus;

    const comment = await this.commentsRepository.getCommentById(
      command.commentId,
    );

    if (!comment) return false;

    comment.setLikeStatus(command.userId, login, likeStatus);

    await this.commentsRepository.save(comment);

    return true;
  }
}
