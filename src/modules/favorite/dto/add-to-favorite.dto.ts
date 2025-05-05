import { IsString } from 'class-validator';

export class AddToFavoriteDto {
  @IsString()
  bookId: string;
}
