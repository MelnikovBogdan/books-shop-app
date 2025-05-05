import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { BookModule } from '../book/book.module';
import { CartController } from './cart.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), BookModule, UserModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
