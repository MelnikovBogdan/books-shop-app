import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (currentUser.id !== id) {
      throw new HttpException(
        "You can't perform this action",
        HttpStatus.FORBIDDEN,
      );
    }

    return this.userService.update(id, updateUserDto);
  }

  @Get(':me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  me(@CurrentUser() currentUser: User) {
    return currentUser;
  }
}
