import { IsString, Length, MaxLength, Validate } from "class-validator";
import { BlogExistValidation } from "./blogs-input-validator";

export class PostPostType {
  @Length(1, 30)
  title: string;
  
  @Length(1, 100)
  shortDescription: string;

  @Length(1, 1000)
  content: string;

  @IsString()
  @Validate(BlogExistValidation)
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
  @Validate(BlogExistValidation)
  blogId: string;
}



