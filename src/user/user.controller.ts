import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  ValidationCreateUserDTOPipe,
  ValidationFindUserDTOPipe,
} from './user.pipe';
import { TokenGuard } from 'src/token/token.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body(ValidationCreateUserDTOPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.findOne(userId);
  }
  @Patch(':id')
  @UseGuards(TokenGuard)
  update(
    @Param(ValidationFindUserDTOPipe) user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user, updateUserDto);
  }
  @Delete(':id')
  @UseGuards(TokenGuard)
  remove(@Param(ValidationFindUserDTOPipe) user: User) {
    return this.userService.remove(user);
  }
}
