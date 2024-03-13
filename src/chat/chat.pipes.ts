import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ValidationCreateChatDTOPipe implements PipeTransform {
    constructor( @InjectRepository(User) private readonly userRepository: Repository<User>){}
  async transform(value: CreateChatDto) {
    const userData = await this.userRepository.findOneBy({
        id: value.user,
      });
      if (!userData) {
        throw new HttpException(
          `404 Not found user_id: ${value.user}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        ...value,
        userData
      };
    }
}

@Injectable()
export class ValidationFindChatDTOPipe implements PipeTransform {
    constructor( @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>){}
  async transform(value: { id: string }) {
    const id = Number(value.id);
    if(isNaN(id)) {
      throw new HttpException(
        `400 Bad Request`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const chatFind = await this.chatRepository.findOneBy({ id });
    if(!chatFind) {
      throw new HttpException(
        `404 Not found chat id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return chatFind;
  }
}

@Injectable()
export class ValidationChatDTOPipe implements PipeTransform {
    constructor( @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>){}
  async transform(value: UpdateChatDto) {
    const updateChatKey = Object.keys(value);
    for (const keys of updateChatKey) {
      if (!value[keys]) {
        throw new HttpException(
          `422 Unprocessable entity. Keys - ${keys}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    return value;
  }
}
