import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToFavoriteDto } from './dto/add-to-favorite.dto';
import { FavoriteService } from './favorite.service';
import { User } from '../user/entities/user.entity';
import { RemoveFromFavoriteDto } from './dto/remove-from-favorite.dto';
import { Book } from '../book/entities/book.entity';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('add-book')
  @UseGuards(JwtAuthGuard)
  async addBook(
    @CurrentUser() currentUser: User,
    @Body() addToFavoriteDto: AddToFavoriteDto,
  ): Promise<void> {
    await this.favoriteService.addBook(currentUser, addToFavoriteDto.bookId);
  }

  @Post('remove-book')
  @UseGuards(JwtAuthGuard)
  async removeBook(
    @CurrentUser() currentUser: User,
    @Body() removeFromFavoriteDto: RemoveFromFavoriteDto,
  ): Promise<void> {
    await this.favoriteService.removeBook(
      currentUser,
      removeFromFavoriteDto.bookId,
    );
  }

  @Post('clear')
  @UseGuards(JwtAuthGuard)
  async clear(@CurrentUser() currentUser: User): Promise<void> {
    await this.favoriteService.clearFavorite(currentUser);
  }

  @Get('books')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getFavorite(@CurrentUser() currentUser: User): Promise<Book[]> {
    return await this.favoriteService.findFavoriteBooks(currentUser);
  }
}
