import { IsNumberString, MaxLength } from "class-validator";

export class PostPostType {
  @MaxLength(30)
  title: string;
  
  @MaxLength(100)
  shortDescription: string;

  @MaxLength(1000)
  content: string;

  @IsNumberString()
  blogId: string;
}

export class PostPutType {
  @MaxLength(30)
  title: string;

  @MaxLength(100)
  shortDescription: string;

  @MaxLength(1000)
  content: string;

  @IsNumberString()
  blogId: string;
}



