import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentPostType } from '../../api/dto/input/comments-input-dto';
import { InjectModel } from '@nestjs/mongoose';
import { CommentForPost, CommentModelType } from '../../domain/comments-entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/application/users-service';
import { PostsSQLQueryRepository } from '../../../posts/infrastructure/posts-sql-query-repository';
import { CommentsSQLRepository } from '../../infrastructure/comments-sql-repository';
import { CommentForPostSQL } from '../../domain/comments-sql-entity';
// import { CommentsRepository } from '../../infrastructure/comments-repository';
// import { PostsQueryRepository } from '../../../posts/infrastructure/posts-query-repository';

export class CommentsCreateCommentCommand {
  constructor(
    public dto: CommentPostType,
    public userId: string,
    public postId: string,
  ) {}
}

@CommandHandler(CommentsCreateCommentCommand)
export class CommentsCreateCommentUseCase
  implements ICommandHandler<CommentsCreateCommentCommand>
{
  constructor(
    @InjectModel(CommentForPost.name) private CommentModel: CommentModelType,
    // private readonly commentsRepository: CommentsRepository,
    private readonly commentsRepository: CommentsSQLRepository,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    // private readonly postsQueryRepository: PostsQueryRepository,
    protected postsQueryRepository: PostsSQLQueryRepository,
  ) {}

  async execute(command: CommentsCreateCommentCommand): Promise<string | null> {
    const user = await this.usersService.findUserDbByID(command.userId);

    if (!user) return null;

    const post = await this.postsQueryRepository.findPostByID(command.postId);

    if (post) {
      const newComment = CommentForPostSQL /*CommentForPost*/.createComment(
        command.dto.content,
        post.id,
        user.id /*_id*/
          .toString(),
        user.login,
      );

      //const newCommentModel = new this.CommentModel(newComment);

      const result = await this.commentsRepository.save(
        newComment /*newCommentModel*/,
      );

      return result /*newCommentModel._id.toString()*/;
    }

    return null;
  }
}
