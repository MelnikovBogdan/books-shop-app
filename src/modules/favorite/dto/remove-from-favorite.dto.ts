import { IsString } from 'class-validator';

export class RemoveFromFavoriteDto {
  @IsString()
  bookId: string;
}
