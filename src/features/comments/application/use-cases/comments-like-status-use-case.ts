import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepository } from "../../infrastructure/comments-repository";
import { LikeStatus } from "../../../../infrastructure/dto/input/input-dto";
import { UsersService } from "../../../users/application/users-service";

export class CommentsLikeStatusCommand {
    constructor(
        public commentId: string, 
        public userId: string, 
        public dto: LikeStatus
    ){};
};

@CommandHandler(CommentsLikeStatusCommand)
export class CommentsLikeStatusUseCase implements ICommandHandler<CommentsLikeStatusCommand> {
    constructor (
        private readonly commentsRepository: CommentsRepository,
        private readonly usersService: UsersService,
    ){}

    async execute(command: CommentsLikeStatusCommand): Promise<boolean> {
        const user = await this.usersService.findUserDbByID(command.userId);
    
        if (!user) return false;
    
        const login = user.login;
        const likeStatus = command.dto.likeStatus;
    
        const comment = await this.commentsRepository.getCommentById(command.commentId);
        
        if (!comment) return false;
    
        comment.setLikeStatus(command.userId, login, likeStatus);
        
        await this.commentsRepository.save(comment);
    
        return true;
    };
};