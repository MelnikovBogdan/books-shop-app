import { IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @MaxLength(255)
  name: string;
}
