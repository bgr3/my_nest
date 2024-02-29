import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { QueryFilter } from '../../../../../infrastructure/dto/input/input-dto';

export class UserPost {
  @Length(3, 10)
  login: string;

  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}

export class UserQueryFilter extends QueryFilter {
  @IsOptional()
  @IsString()
  searchLoginTerm: string = '';

  @IsOptional()
  @IsString()
  searchEmailTerm: string = '';
}
