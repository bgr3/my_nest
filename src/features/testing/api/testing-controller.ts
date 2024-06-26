import { Controller, Delete, HttpCode } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { AccessTestAllDataCommand } from '../../access/application/use-cases/access-test-all-data-use-case';
import { AuthTestAllDataCommand } from '../../auth/application/use-cases/auth-test-all-data-use-case';
import { BlogsTestAllDataCommand } from '../../blogs/application/use-cases/blogs-test-all-data-use-case';
import { CommentsTestAllDataCommand } from '../../comments/application/use-cases/comments-test-all-data-use-case';
import { QuizTestAllDataCommand } from '../../pair-quiz-game/application/commands/quiz-test-all-data-use-case';
import { PostsTestAllDataCommand } from '../../posts/application/use-cases/posts-test-all-data-use-case';
import { UsersTestAllDataCommand } from '../../users/application/use-cases/users-testing-all-data-use-case';

@Controller('testing')
export class TestingController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete('all-data')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async allData(): Promise<void> {
    await this.commandBus.execute(new UsersTestAllDataCommand());
    await this.commandBus.execute(new BlogsTestAllDataCommand());
    await this.commandBus.execute(new PostsTestAllDataCommand());
    await this.commandBus.execute(new CommentsTestAllDataCommand());
    await this.commandBus.execute(new AccessTestAllDataCommand());
    await this.commandBus.execute(new AuthTestAllDataCommand());
    await this.commandBus.execute(new QuizTestAllDataCommand());

    return;
  }
}
