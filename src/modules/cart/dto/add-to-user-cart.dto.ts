import { IsString } from 'class-validator';

export class AddToUserCartDto {
  @IsString()
  bookId: string;
}
