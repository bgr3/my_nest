import { IsString, Length, MaxLength } from "class-validator";

export class PostPostType {
  @Length(1, 30)
  title: string;
  
  @Length(1, 100)
  shortDescription: string;

  @Length(1, 1000)
  content: string;

  @IsString()
  blogId: string;
}

export class PostPutType {
  @Length(1, 30)
  title: string;

  @Length(1, 100)
  shortDescription: string;

  @Length(1, 1000)
  content: string;

  @IsString()
  blogId: string;
}



