import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Book } from '../../book/entities/book.entity';

@Entity()
export class Category {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToMany(() => Book, (book) => book.categories)
  books: Book[];
}
