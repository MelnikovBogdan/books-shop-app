import { SelectQueryBuilder } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

export async function paginateWithQueryBuilder<T extends object>(
  qb: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const { page, limit } = options;
  return paginate(qb.skip((+page - 1) * +limit).take(+limit), options);
}
