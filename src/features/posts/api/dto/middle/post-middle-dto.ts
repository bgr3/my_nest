import { PostOutput } from '../output/post-output-type';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export abstract class PostFilterType {
    @IsNumber()
    @IsOptional()
    pageNumber: number
    pageSize: number
   
   abstract sortBy: string
   abstract sortDirection: string
}

class BlogFilterInputDto extends PostFilterType {
@IsEnum({})
sortBy: string;
sortDirection: string;
}



export class PostPaginatorType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: PostOutput[],
  ) {}
}

export class LikesInfo {
  constructor(
    public userId: string,
    public login: string,
    public addedAt: string,
    public likeStatus: string,
  ) {}
}
