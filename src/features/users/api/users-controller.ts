import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Res } from "@nestjs/common";
import { UsersService } from "../application/users-service";
import { HTTP_STATUSES } from "../../../http-statuses";
import { UsersQueryRepository } from "../infrastructure/users-query-repository";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersQueryRepository: UsersQueryRepository,
        private readonly usersService: UsersService){}

    @Post()
    async createUser (@Body() dto, @Res() res)  {
      
      let result = await this.usersService.createUser(dto, true)
      
      if (!result) {

        res.status(HTTP_STATUSES.BAD_REQUEST_400);
        return
      } 
  
      const newUser = await this.usersQueryRepository.findUserByID(result)
        
      res.status(HTTP_STATUSES.CREATED_201).send(newUser);

      return
    }

    @Get()
    async getUsers(@Query() query)  {
      const queryFilter = query //userCheckQuery(query)
      
      return await this.usersQueryRepository.findUsers(queryFilter);
    }

    @Delete('/:id')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteUser(@Param('id') id: string, @Res() res)  {
    
      const foundBlog = await this.usersService.deleteUser(id)
    
      if (foundBlog) {
        return
      } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return
      }
    }
}

