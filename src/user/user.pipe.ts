import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class ValidationCreateUserDTOPipe implements PipeTransform {
    constructor( @InjectRepository(User) private readonly userRepository: Repository<User>){}
  async transform(value: CreateUserDto) {
      const findUser = await this.userRepository.findOneBy({
        login: value.login,
      });
      if (findUser) {
        throw new HttpException(
          'User login is not allowed',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      return value;
    }
}

@Injectable()
export class ValidationFindUserDTOPipe implements PipeTransform {
    constructor( @InjectRepository(User) private readonly userRepository: Repository<User>){}
  async transform(value: { id: string }) {
    const id = Number(value.id);
    if(isNaN(id)) {
      throw new HttpException(
        `400 Bad Request`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const userFind = await this.userRepository.findOneBy({ id });
    if(!userFind) {
      throw new HttpException(
        `404 Not found user`,
        HttpStatus.NOT_FOUND,
      );
    }
    return userFind;
  }
}

