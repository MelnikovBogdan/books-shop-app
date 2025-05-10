import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  author: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  publisher?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageSrc?: string;

  @IsNumber()
  price: number;

  @IsString()
  @MaxLength(255)
  isbn: string;

  @IsArray()
  @IsString({ each: true })
  categoryIds: string[];
}
