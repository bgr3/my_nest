import { Length } from 'class-validator';

export class CommentPostType {
  @Length(20, 300)
    content: string;
}

export class CommentPutType {
  @Length(20, 300)
    content: string;
}
