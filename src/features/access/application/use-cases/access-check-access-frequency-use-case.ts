import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { add } from 'date-fns/add';
import { LogORMRepository } from '../../infrastructure/access-log-orm-repository';
import { AccessLogORM } from '../../domain/access-log-orm-entity';
// import { AccessLog, AccessLogModelType } from '../../domain/access-log-entity';
// import { InjectModel } from '@nestjs/mongoose';
// import { LogRepository } from '../../infrastructure/access-log-repository';

export class AccessCheckAccessFrequencyCommand {
  constructor(
    public url: string,
    public ip: string,
  ) {}
}

@CommandHandler(AccessCheckAccessFrequencyCommand)
export class AccessCheckAccessFrequencyUseCase
  implements ICommandHandler<AccessCheckAccessFrequencyCommand>
{
  constructor(
    // @InjectModel(AccessLog.name) private AccessLogModel: AccessLogModelType,
    // protected logRepository: LogRepository,
    protected logRepository: LogORMRepository,
  ) {}

  async execute(command: AccessCheckAccessFrequencyCommand): Promise<boolean> {
    const lastDate = await this.logRepository.findAccessLogByURLAndIp(
      command.url,
      command.ip,
    );

    if (lastDate[0]) {
      if (new Date() < add(lastDate[0], { seconds: 10 })) {
        if (lastDate[4]) {
          if (new Date() < add(lastDate[4], { seconds: 10 })) return false;
        }
      }
    }

    const log = {
      URL: command.url,
      IP: command.ip,
    };

    const accessLog = AccessLogORM.createAccessLog(log);

    // const newAuthModel = new this.AccessLogModel(accessLog);

    await this.logRepository.save(accessLog /*newAuthModel*/);

    return true;
  }
}
