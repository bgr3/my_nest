import { CommentOutput } from '../output/comments-output-dto';

// export class CommentsCollection {
//   constructor(
//     public postId: string,
//     public content: string,
//     public commentatorInfo: {
//       userId: string;
//       userLogin: string;
//     },
//     public createdAt: string,
//     public likesInfo: {
//       likes: string[];
//       dislikes: string[];
//     },
//   ) {}
// }

export class CommentsFilter {
  constructor(
    public pageNumber: number,
    public pageSize: number,
    public sortBy: string,
    public sortDirection: string,
  ) {}
}

export class CommentPaginatorType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: CommentOutput[],
  ) {}
}


