import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LogRepository } from "../../infrastructure/access-log-repository";

export class AccessTestAllDataCommand {
    constructor(){};
};

@CommandHandler(AccessTestAllDataCommand)
export class AccessTestAllDataUseCase implements ICommandHandler<AccessTestAllDataCommand> {
    constructor (protected logRepository: LogRepository,){}

    async execute(command: AccessTestAllDataCommand): Promise<void> {
        return this.logRepository.testAllData();      
    };
};