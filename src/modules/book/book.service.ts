import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Brackets, Repository } from 'typeorm';
import { paginateWithQueryBuilder } from '../../shared/paginateWithQueryBuilder';
import { PaginatedResponse } from '../../types/pagination.type';
import { CategoryService } from '../category/category.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll(
    search = '',
    categoryIds: string = '',
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Book>> {
    try {
      const queryBuilder = this.bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.categories', 'category');

      if (search) {
        queryBuilder.where(
          new Brackets((qb) => {
            qb.where('book.name ILIKE :search', { search: `%${search}%` });
            qb.orWhere('book.author ILIKE :search', { search: `%${search}%` });
            qb.orWhere('book.publisher ILIKE :search', {
              search: `%${search}%`,
            });
          }),
        );
      }

      if (categoryIds) {
        const splittedCategoryIds = categoryIds.split(',');

        queryBuilder.andWhere('category.id IN (:...categoryIds)', {
          categoryIds: splittedCategoryIds,
        });
      }

      queryBuilder.orderBy('book.created_at', 'ASC');

      const { items, meta } = await paginateWithQueryBuilder(queryBuilder, {
        page: page,
        limit: limit,
      });

      return {
        items,
        currentPage: page,
        totalPages: meta.totalPages ?? 0,
        totalItems: meta.itemCount,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error while fetching books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = new Book();

    book.id = uuidv4();
    book.name = createBookDto.name;
    book.author = createBookDto.author;
    book.description = createBookDto.description;
    book.publisher = createBookDto.publisher;
    book.imageSrc = createBookDto.imageSrc;
    book.price = createBookDto.price;
    book.isbn = createBookDto.isbn;
    book.categories = await this.categoryService.findAllByIds(
      createBookDto.categoryIds,
    );

    return await this.bookRepository.save(book);
  }

  async findOne(id: string): Promise<Book> {
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.categories', 'category')
      .where('book.id = :id', { id });

    const book = await queryBuilder.getOne();

    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    book.name = updateBookDto.name ?? book.name;
    book.author = updateBookDto.author ?? book.author;
    book.description = updateBookDto.description ?? book.description;
    book.publisher = updateBookDto.publisher ?? book.publisher;
    book.imageSrc = updateBookDto.imageSrc ?? book.imageSrc;
    book.price = updateBookDto.price ?? book.price;
    book.isbn = updateBookDto.isbn ?? book.isbn;
    book.categories = updateBookDto.categoryIds
      ? await this.categoryService.findAllByIds(updateBookDto.categoryIds)
      : book.categories;

    return await this.bookRepository.save(book);
  }

  remove(id: string) {
    return this.bookRepository.delete(id);
  }
}
