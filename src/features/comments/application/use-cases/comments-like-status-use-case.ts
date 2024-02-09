import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepository } from "../../infrastructure/comments-reppository";
import { LikeStatus } from "../../../../infrastructure/dto/input/input-dto";
import { JwtService } from "@nestjs/jwt";
import { PostsQueryRepository } from "../../../posts/infrastructure/posts-query-repository";
import { PostsRepository } from "../../../posts/infrastructure/posts-repository";
import { UsersService } from "../../../users/application/users-service";

export class CommentsLikeStatusCommand {
    constructor(
        public commentId: string, 
        public accessToken: string, 
        public dto: LikeStatus
    ){};
};

@CommandHandler(CommentsLikeStatusCommand)
export class CommentsLikeStatusUseCase implements ICommandHandler<CommentsLikeStatusCommand> {
    constructor (
        protected commentsRepository: CommentsRepository,
        protected jwtService: JwtService,
        protected usersService: UsersService,
        protected postsQueryRepository: PostsQueryRepository,
        protected postsRepository: PostsRepository,
    ){}

    async execute(command: CommentsLikeStatusCommand): Promise<boolean> {
        const userId = await this.jwtService.verifyAsync(command.accessToken);
        const user = await this.usersService.findUserDbByID(userId);
    
        if (!user) return false;
    
        const login = user.login;
        const likeStatus = command.dto.likeStatus;
    
        const comment = await this.postsRepository.getPostById(command.commentId);
        
        if (!comment) return false;
    
        comment.setLikeStatus(userId, login, likeStatus);
        await this.postsRepository.save(comment);
    
        return true;
    };
};