import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepository } from "../../infrastructure/comments-repository";
import { CommentPutType } from "../../api/dto/input/comments-input-dto";

export class CommentsUpdateCommentCommand {
    constructor(
        public id: string, 
        public dto: CommentPutType){};
};

@CommandHandler(CommentsUpdateCommentCommand)
export class CommentsUpdateCommentUseCase implements ICommandHandler<CommentsUpdateCommentCommand> {
    constructor (protected commentsRepository: CommentsRepository,){}

    async execute(command: CommentsUpdateCommentCommand): Promise<boolean> {
        const comment = await this.commentsRepository.getCommentById(command.id);

        if (!comment) return false;
    
        comment.updateComment(command.dto.content);
    
        await this.commentsRepository.save(comment);
    
        return true; 
    };
};