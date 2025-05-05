import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Exclude } from 'class-transformer';
import { Cart } from '../../cart/entities/cart.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';

@Entity()
export class Book {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  author: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  description?: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  publisher?: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  image_src?: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', length: 255 })
  isbn: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Category, {
    cascade: true,
  })
  @JoinTable({
    name: 'book-categories',
  })
  categories?: Category[];

  @Exclude()
  @ManyToMany(() => Cart, {
    cascade: true,
  })
  @JoinTable({
    name: 'cart-books',
  })
  carts: Cart[];

  @Exclude()
  @ManyToMany(() => Favorite, {
    cascade: true,
  })
  @JoinTable({
    name: 'favorite-books',
  })
  favorite: Favorite[];
}
