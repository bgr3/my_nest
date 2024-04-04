import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../../infrastructure/dto/input/input-dto';
import { UsersService } from '../../../users/application/users-service';
import { PostsORMRepository } from '../../infrastructure/orm/posts-orm-repository';
// import { PostsSQLRepository } from '../../infrastructure/sql/posts-sql-repository';
// import { PostsRepository } from '../../infrastructure/posts-repository';

export class PostsLikeStatusCommand {
  constructor(
    public postId: string,
    public userId: string,
    public dto: LikeStatus,
  ) {}
}

@CommandHandler(PostsLikeStatusCommand)
export class PostsLikeStatusUseCase
  implements ICommandHandler<PostsLikeStatusCommand>
{
  constructor(
    // private readonly postsRepository: PostsRepository,
    // private readonly postsRepository: PostsSQLRepository,
    private readonly postsRepository: PostsORMRepository,
    private readonly usersService: UsersService,
  ) {}

  async execute(command: PostsLikeStatusCommand): Promise<boolean> {
    const user = await this.usersService.findUserDbByID(command.userId);

    if (!user) return false;

    const login = user.login;
    const likeStatus = command.dto.likeStatus;

    const post = await this.postsRepository.getPostById(command.postId);

    if (!post) return false;

    post.setLikeStatus(command.userId, login, likeStatus);
    await this.postsRepository.save(post);

    return true;
  }
}
