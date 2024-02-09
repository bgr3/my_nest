import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LogRepository } from "../../infrastructure/access-log-repository";
import { InjectModel } from "@nestjs/mongoose";
import { AccessLog, AccessLogModelType } from "../../domain/access-log-entity";
import { add } from 'date-fns/add';

export class AccessCheckaccessFrequencyCommand {
    constructor(
        public url: string, 
        public ip: string
    ){};
};

@CommandHandler(AccessCheckaccessFrequencyCommand)
export class AccessCheckaccessFrequencyUseCase implements ICommandHandler<AccessCheckaccessFrequencyCommand> {
    constructor (
        @InjectModel(AccessLog.name) private AccessLogModel: AccessLogModelType,
        protected logRepository: LogRepository,
        ){}

    async execute(command: AccessCheckaccessFrequencyCommand): Promise<boolean> {
        const lastDate = await this.logRepository.findAccessLogByURLAndIp(command.url, command.ip)
        
        if(lastDate[0]){
            if(new Date() < add(lastDate[0], {seconds: 10})){
                if (lastDate[4]) {
                    if (new Date() < add(lastDate[4], {seconds: 10})) return false
                }
            }
        }
    
        const log = {
            URL: command.url,
            IP: command.ip,
        }

        const accessLog = AccessLog.createAccessLog(log);
      
          const newAuthModel = new this.AccessLogModel(accessLog);
      
          await this.logRepository.save(newAuthModel);

        return true  
    };
};