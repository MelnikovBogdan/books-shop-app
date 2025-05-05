import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(50)
  fullName: string;

  @IsString()
  @Length(8, 50)
  password: string;
}
