import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostsRepository } from "../../infrastructure/posts-repository";
import { LikeStatus } from "../../../../infrastructure/dto/input/input-dto";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../../users/application/users-service";

export class PostsLikeStatusCommand {
    constructor(
        public postId: string, 
        public accessToken: string, 
        public dto: LikeStatus
    ){};
};

@CommandHandler(PostsLikeStatusCommand)
export class PostsLikeStatusUseCase implements ICommandHandler<PostsLikeStatusCommand> {
    constructor (
        protected postsRepository: PostsRepository,
        protected jwtService: JwtService,
        protected usersService: UsersService,
    ){}

    async execute(command: PostsLikeStatusCommand): Promise<boolean> {
        const userId = await this.jwtService.verifyAsync(command.accessToken);
        const user = await this.usersService.findUserDbByID(userId);
  
        if (!user) return false;
  
        const login = user.login;
        const likeStatus = command.dto.likeStatus;
  
        const post = await this.postsRepository.getPostById(command.postId);
        
        if (!post) return false;
  
        post.setLikeStatus(userId, login, likeStatus);
        await this.postsRepository.save(post);
  
        return true;
    };
};