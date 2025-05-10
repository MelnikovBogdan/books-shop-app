import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { CryptoService } from '../crypto/crypto.service';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {}
  findOne(id: string, options?: FindOneOptions<User>): Promise<User | null> {
    return this.userRepository.findOne({
      ...options,
      where: { ...options?.where, id },
    });
  }

  async update(
    id: string,
    data: {
      fullName?: string;
      password?: string;
      refreshToken?: string;
      cart?: Cart;
    },
  ) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (data.fullName) {
      user.fullName = data.fullName;
    }

    if (data.password) {
      user.password = await this.cryptoService.generateHash(data.password);
    }

    if (data.refreshToken) {
      user.refreshToken = data.refreshToken;
    }

    if (data.cart) {
      user.cart = data.cart;
    }

    return await this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userWithSameEmail = await this.findOneByEmail(createUserDto.email);

    if (userWithSameEmail) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User();

    user.id = uuid();
    user.email = createUserDto.email;
    user.role = 'USER';
    user.password = await this.cryptoService.generateHash(
      createUserDto.password,
    );
    user.fullName = createUserDto.fullName;

    return await this.userRepository.save(user);
  }
}
