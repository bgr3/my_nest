import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepository } from "../../infrastructure/comments-reppository";

export class CommentsDeleteCommentCommand {
    constructor(public id: string){};
};

@CommandHandler(CommentsDeleteCommentCommand)
export class CommentsDeleteCommentUseCase implements ICommandHandler<CommentsDeleteCommentCommand> {
    constructor (protected commentsRepository: CommentsRepository,){}

    async execute(command: CommentsDeleteCommentCommand): Promise<boolean> {
        return await this.commentsRepository.deleteComment(command.id);      
    };
};