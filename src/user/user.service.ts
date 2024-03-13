import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const passwordBcryptSalt = bcrypt.genSaltSync(10);
    const passwordBcrypt = bcrypt.hashSync(
      createUserDto.password,
      passwordBcryptSalt,
    );
    const user = await this.userRepository.create({
      login: createUserDto.login,
      password: passwordBcrypt,
    });
    const saveUser = await this.userRepository.save(user);
    delete saveUser.password;
    return saveUser;
  }
  async findAll() {
    const users = await this.userRepository.findAndCount({
      select: {
        id: true,
        login: true,
      },
    });
    return {
      data: users[0],
      count: users[1],
    };
  }
  async findOne(userId: number) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: {
        id: true,
        login: true,
      },
    });
  }
  async update(user: User, updateUserDto: UpdateUserDto) {
    const userKeyInUpdate = Object.keys(updateUserDto);
    for (const keys of userKeyInUpdate) {
      user[keys] = updateUserDto[keys];
    }
    const update_user = await this.userRepository.save(user);
    delete update_user.password;
    return update_user;
  }
  async remove(user: User) {
    return await this.userRepository.remove(user);
  }
}
