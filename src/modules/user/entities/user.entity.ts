import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Cart } from '../../cart/entities/cart.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  role: 'ADMIN' | 'USER';

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  refresh_token: string | null;

  @OneToOne(() => Cart, { cascade: true })
  @JoinColumn()
  cart: Cart;

  @OneToOne(() => Favorite, { cascade: true })
  @JoinColumn()
  favorite: Favorite;
}
