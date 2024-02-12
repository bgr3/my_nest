import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepository } from "../../infrastructure/comments-repository";
import { CommentPostType } from "../../api/dto/input/comments-input-dto";
import { InjectModel } from "@nestjs/mongoose";
import { CommentForPost, CommentModelType } from "../../domain/comments-entity";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../../users/application/users-service";
import { PostsQueryRepository } from "../../../posts/infrastructure/posts-query-repository";

export class CommentsCreateCommentCommand {
    constructor(
      public dto: CommentPostType,
      public userId: string, 
      public postId: string,
    ){};
};

@CommandHandler(CommentsCreateCommentCommand)
export class CommentsCreateCommentUseCase implements ICommandHandler<CommentsCreateCommentCommand> {
    constructor (
      @InjectModel(CommentForPost.name) private CommentModel: CommentModelType,
      protected commentsRepository: CommentsRepository,
      protected jwtService: JwtService,
      protected usersService: UsersService,
      protected postsQueryRepository: PostsQueryRepository,
      ){}

    async execute(command: CommentsCreateCommentCommand): Promise<string | null> {
      const user = await this.usersService.findUserDbByID(command.userId);
  
      if (!user) return null;
  
      const post = await this.postsQueryRepository.findPostByID(command.postId);
  
      if (post) {
        const newComment = CommentForPost.createComment(
          command.dto.content,
          post.id,
          user._id.toString(),
          user.login
        );
  
        const newCommentModel = new this.CommentModel(newComment);
  
        await this.commentsRepository.save(newCommentModel);
  
        return newCommentModel._id.toString();
      }
  
      return null;  
    };
};