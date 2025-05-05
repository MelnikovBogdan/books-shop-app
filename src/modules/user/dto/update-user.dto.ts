import { IsString, Length, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(50)
  fullName?: string;

  @IsString()
  @Length(8, 50)
  password?: string;
}
