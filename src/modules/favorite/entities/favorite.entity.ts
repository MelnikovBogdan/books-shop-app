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
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Book, { cascade: true })
  @JoinTable({
    name: 'user-favorite_books',
  })
  books: Book[];

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;
}
