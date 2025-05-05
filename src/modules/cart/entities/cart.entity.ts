import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../book/entities/book.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Book, { cascade: true })
  @JoinTable({
    name: 'user-cart_books',
  })
  books: Book[];

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;
}
