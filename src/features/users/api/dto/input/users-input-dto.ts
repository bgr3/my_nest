import { IsEmail, Length } from "class-validator";

export class UserPostType {
  @Length(3, 10)
  login: string;

  @Length(6, 20)
  password: string;

  @IsEmail()
  email: string;
}

export class UserFilter {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
}