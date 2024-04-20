import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LogORMRepository } from '../../infrastructure/access-log-orm-repository';
// import { LogRepository } from '../../infrastructure/access-log-repository';

export class AccessTestAllDataCommand {
  constructor() {}
}

@CommandHandler(AccessTestAllDataCommand)
export class AccessTestAllDataUseCase
  implements ICommandHandler<AccessTestAllDataCommand>
{
  constructor(
    // protected logRepository: LogRepository,
    protected logRepository: LogORMRepository,
  ) {}

  async execute(): Promise<void> {
    return this.logRepository.testAllData();
  }
}
