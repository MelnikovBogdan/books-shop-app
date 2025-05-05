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
import { AddToUserCartDto } from './dto/add-to-user-cart.dto';
import { CartService } from './cart.service';
import { User } from '../user/entities/user.entity';
import { RemoveFromUserCartDto } from './dto/remove-from-user-cart.dto';
import { Book } from '../book/entities/book.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-book')
  @UseGuards(JwtAuthGuard)
  async addBook(
    @CurrentUser() currentUser: User,
    @Body() addToUserCartDto: AddToUserCartDto,
  ): Promise<void> {
    await this.cartService.addBook(currentUser, addToUserCartDto.bookId);
  }

  @Post('remove-book')
  @UseGuards(JwtAuthGuard)
  async removeBook(
    @CurrentUser() currentUser: User,
    @Body() removeFromUserCartDto: RemoveFromUserCartDto,
  ): Promise<void> {
    await this.cartService.removeBook(
      currentUser,
      removeFromUserCartDto.bookId,
    );
  }

  @Post('clear')
  @UseGuards(JwtAuthGuard)
  async clear(@CurrentUser() currentUser: User): Promise<void> {
    await this.cartService.clearCart(currentUser);
  }

  @Get('books')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getCartBooks(@CurrentUser() currentUser: User): Promise<Book[]> {
    return await this.cartService.findCartBooks(currentUser);
  }
}
