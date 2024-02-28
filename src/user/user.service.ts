import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    if(!createUserDto.login || !createUserDto.password) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const find_user = await this.userRepository.findOneBy({
      login: createUserDto.login,
    });
    if(find_user) {
      throw new HttpException('User login is not allowed', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const passwordBcryptSalt = bcrypt.genSaltSync(10);
    const passwordBcrypt = bcrypt.hashSync(createUserDto.password, passwordBcryptSalt);
    const user = await this.userRepository.create({
      login: createUserDto.login,
      password: passwordBcrypt,
    });
    const save_user = await this.userRepository.save(user);
    delete save_user.password;
    return save_user;
  }
  async findAll() {
    const users = await this.userRepository.findAndCount({
      select: {
        id: true,
        login: true,
      }
    });
    return {
      data: users[0],
      count: users[1],
    };
  }
  async findOne(id: number) {
    if(!id) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        login: true,
      }
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const userKeyInUpdate = Object.keys(updateUserDto);
    const user = await this.userRepository.findOneBy({ id });
    if(!userKeyInUpdate.length) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if(!user || !id) {
      throw new HttpException(`404 Not found user: ${updateUserDto.login}`, HttpStatus.NOT_FOUND);
    }
    for(let keys of userKeyInUpdate) {
      if(!updateUserDto[keys]) {
        throw new HttpException(`422 Unprocessable emtity. Keys - ${keys}`, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      user[keys] = updateUserDto[keys];
    }
    const update_user = await this.userRepository.save(user);
    delete update_user.password;
    return update_user;
  }
  async remove(id: number) {
    if(!id) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const user = await this.userRepository.findOneBy({ id });
    if(!user) {
      throw new HttpException('404 Not found', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.remove(user);
  }
}
