import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';

// import { PostsSQLQueryRepository } from '../../../posts/infrastructure/sql/posts-sql-query-repository';
// import { CommentsSQLRepository } from '../../infrastructure/sql/comments-sql-repository';
// import { CommentForPostSQL } from '../../domain/comments-sql-entity';
import { PostsORMQueryRepository } from '../../../posts/infrastructure/orm/posts-orm-query-repository';
// import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/application/users-service';
import { CommentPostType } from '../../api/dto/input/comments-input-dto';
import { CommentForPost, CommentModelType } from '../../domain/comments-entity';
import { CommentForPostORM } from '../../domain/comments-orm-entity';
import { CommentsORMRepository } from '../../infrastructure/orm/comments-orm-repository';
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
    // private readonly commentsRepository: CommentsSQLRepository,
    private readonly commentsRepository: CommentsORMRepository,
    // private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    // private readonly postsQueryRepository: PostsQueryRepository,
    // protected postsQueryRepository: PostsSQLQueryRepository,
    protected postsQueryRepository: PostsORMQueryRepository,
  ) {}

  async execute(command: CommentsCreateCommentCommand): Promise<string | null> {
    const user = await this.usersService.findUserDbByID(command.userId);

    if (!user) return null;

    const post = await this.postsQueryRepository.findPostByID(command.postId);

    if (post) {
      const newComment =
        CommentForPostORM /*CommentForPostSQL*/ /*CommentForPost*/.createComment(
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
