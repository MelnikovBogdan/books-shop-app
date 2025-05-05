import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookService } from '../book/book.service';
import { User } from '../user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private readonly bookService: BookService,
  ) {}

  async addBook(currentUser: User, bookId: string): Promise<Cart> {
    const book = await this.bookService.findOne(bookId);

    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.books', 'books')
      .where('user.id = :userId', { userId: currentUser.id })
      .getOne();

    if (!cart) {
      const newCart = new Cart();
      newCart.user = currentUser;
      newCart.books = [book];
      return await this.cartRepository.save(newCart);
    }

    const sameBookInCart = cart.books.find((b) => b.id === book.id);

    if (sameBookInCart) {
      throw new HttpException(
        'Book already exists in cart',
        HttpStatus.BAD_REQUEST,
      );
    }

    cart.books = [...cart.books, book];
    return await this.cartRepository.save(cart);
  }

  async removeBook(currentUser: User, bookId: string): Promise<Cart> {
    const book = await this.bookService.findOne(bookId);

    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.books', 'books')
      .where('user.id = :userId', { userId: currentUser.id })
      .getOne();

    if (!cart) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    const bookIndex = cart.books.findIndex((b) => b.id === book.id);

    if (bookIndex === -1) {
      throw new HttpException('Book not found in cart', HttpStatus.NOT_FOUND);
    }

    cart.books.splice(bookIndex, 1);

    return await this.cartRepository.save(cart);
  }

  async clearCart(currentUser: User): Promise<Cart> {
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .where('user.id = :userId', { userId: currentUser.id })
      .getOne();

    if (!cart) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    cart.books = [];

    return await this.cartRepository.save(cart);
  }

  async findCartBooks(currentUser: User): Promise<Book[]> {
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.books', 'book')
      .leftJoinAndSelect('book.categories', 'category')
      .where('user.id = :userId', { userId: currentUser.id })
      .getOne();

    if (!cart) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    return cart.books;
  }
}
