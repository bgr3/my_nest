import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from '../../users/application/users-service';
import { HTTP_STATUSES } from '../../../settings/http-statuses';
import { BlogsService } from '../../blogs/application/blog-service';
import { PostsService } from '../../posts/application/post-service';
import { CommentsService } from '../../comments/application/comment-service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
    //private readonly accessService: AccessService,
    //private readonly authService: AuthService
  ) {}

  @Delete('all-data')
  @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
  async allData(req: Request, res: Response) {
    //videosRepository.testAllData
    await this.blogsService.testAllData();
    await this.postsService.testAllData();
    await this.usersService.testAllData();
    await this.commentsService.testAllData();
    // await this.accessService.testAllData()
    // await this.authService.testAllData()
    return;
  }
}
