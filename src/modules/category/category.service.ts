import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();

    category.id = uuidv4();
    category.name = createCategoryDto.name;

    return await this.categoryRepository.save(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    category.name = updateCategoryDto.name ?? category.name;

    return await this.categoryRepository.save(category);
  }

  async findAll(search = ''): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: {
        createdAt: 'desc',
      },
      where: {
        name: ILike(`%${search}%`),
      },
    });
  }

  async findAllByIds(ids: string[]): Promise<Category[]> {
    return Promise.all(
      ids.map(async (id) => {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
          throw new HttpException(
            `Category with id ${id} not found`,
            HttpStatus.BAD_REQUEST,
          );
        }

        return category;
      }),
    );
  }

  async findOne(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async remove(id: string) {
    await this.categoryRepository.delete(id);
  }
}
