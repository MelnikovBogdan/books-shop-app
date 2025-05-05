import { IsString } from 'class-validator';

export class RemoveFromUserCartDto {
  @IsString()
  bookId: string;
}
