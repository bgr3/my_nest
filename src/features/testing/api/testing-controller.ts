import { Controller, Delete } from "@nestjs/common";
import { UsersService } from "../../users/application/users-service";

@Controller('testing')
export class TestingController {
    constructor(
        //private readonly blogsService: BlogsService,
        //private readonly postsService: PostsService,
        private readonly usersService: UsersService,
        // private readonly commentsService: CommentsService,
        // private readonly accessService: AccessService,
        // private readonly authService: AuthService
        ){}

    @Delete('all-data')
    async allData(req: Request, res: Response) { 
      //videosRepository.testAllData
      // await this.blogsService.testAllData()
      // await this.postsService.testAllData()
      await this.usersService.testAllData()
      // await this.commentsService.testAllData()
      // await this.accessService.testAllData()
      // await this.authService.testAllData()
      return
  }
}