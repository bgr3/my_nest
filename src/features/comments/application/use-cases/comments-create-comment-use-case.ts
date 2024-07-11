import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsORMRepository } from '../../../posts/infrastructure/orm/posts-orm-repository';
import { UsersService } from '../../../users/application/users-service';
import { CommentPostType } from '../../api/dto/input/comments-input-dto';
import { CommentForPostORM } from '../../domain/comments-orm-entity';
import { CommentsORMRepository } from '../../infrastructure/orm/comments-orm-repository';

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
    private readonly commentsRepository: CommentsORMRepository,
    private readonly usersService: UsersService,
    protected postsRepository: PostsORMRepository,
  ) {}

  async execute(command: CommentsCreateCommentCommand): Promise<string | null> {
    const user = await this.usersService.findUserDbByID(command.userId);

    if (!user) return null;

    const post = await this.postsRepository.getPostById(command.postId);

    if (!post) return null;

    if (user.blogBanInfo.find((i) => i.blog.id === post.blogId)) return null;

    const newComment = CommentForPostORM.createComment(
      command.dto.content,
      post,
      user,
    );

    const result = await this.commentsRepository.save(newComment);

    return result;
  }
}
