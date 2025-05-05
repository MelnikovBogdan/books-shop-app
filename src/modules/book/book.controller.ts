import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('categoryIds') categoryIds: string,
  ) {
    return this.bookService.findAll(search, categoryIds, page, limit);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getBook(@Param('id') id: string) {
    return await this.bookService.findOne(id);
  }

  @Patch(':ud')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
