import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookService } from '../book/book.service';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private readonly bookService: BookService,
  ) {}

  async addBook(currentUser: User, bookId: string): Promise<Favorite> {
    const book = await this.bookService.findOne(bookId);

    const favorite = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.user', 'user')
      .leftJoinAndSelect('favorite.books', 'books')
      .where('user.id = :userId', { userId: currentUser.id })
      .getOne();

    if (!favorite) {
      const newFavorite = new Favorite();
      newFavorite.user = currentUser;
      newFavorite.books = [book];
      return await this.favoriteRepository.save(newFavorite);
    }

    const sameBookInFavorite = favorite.books.find((b) => b.id === book.id);

    if (sameBookInFavorite) {
      throw new HttpException(
        'Book already exists in favorite',
        HttpStatus.BAD_REQUEST,
      );
    }

    favorite.books = [...favorite.books, book];
    return await this.favoriteRepository.save(favorite);
  }

  async removeBook(currentUser: User, bookId: string): Promise<Favorite> {
    const book = await this.bookService.findOne(bookId);

    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const favorite = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.user', 'user')
      .leftJoinAndSelect('favorite.books', 'books')
      .where('user.id = :userId', { userId: currentUser.id })
      .getOne();

    if (!favorite) {
      throw new HttpException('Favorite is empty', HttpStatus.BAD_REQUEST);
    }

    const bookIndex = favorite.books.findIndex((b) => b.id === book.id);

    if (bookIndex === -1) {
      throw new HttpException(
        'Book not found in favorite',
        HttpStatus.NOT_FOUND,
      );
    }

    favorite.books.splice(bookIndex, 1);

    return await this.favoriteRepository.save(favorite);
  }

  async clearFavorite(currentUser: User): Promise<Favorite> {
    const favorite = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.user', 'user')
      .where('user.id = :userId', { userId: currentUser.id })
      .getOne();

    if (!favorite) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    favorite.books = [];

    return await this.favoriteRepository.save(favorite);
  }

  async findFavoriteBooks(currentUser: User): Promise<Book[]> {
    const favorite = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.user', 'user')
      .leftJoinAndSelect('favorite.books', 'book')
      .leftJoinAndSelect('book.categories', 'category')
      .where('user.id = :userId', { userId: currentUser.id })
      .getOne();

    if (!favorite) {
      return [];
    }

    return favorite.books;
  }
}
