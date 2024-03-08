import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { QueryFilter } from '../../../../../infrastructure/dto/input/input-dto';

export class BlogPostType {
  @ApiProperty()
  @Length(1, 15)
  name: string;

  @ApiProperty()
  @Length(1, 500)
  description: string;

  @ApiProperty()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}

export class PostForBlogPostType {
  @Length(1, 30)
  title: string;

  @Length(1, 100)
  shortDescription: string;

  @Length(1, 1000)
  content: string;

  blogId: string;
}

export class BlogPutType {
  @Length(1, 15)
  name: string;

  @Length(1, 500)
  description: string;

  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}

export class BlogQueryFilter extends QueryFilter {
  @IsOptional()
  @IsString()
  searchNameTerm: string = '';
}

export class PostForBlogPutType {
  @Length(1, 30)
  title: string;

  @Length(1, 100)
  shortDescription: string;

  @Length(1, 1000)
  content: string;

  blogId: string;
}
