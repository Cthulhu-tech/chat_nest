import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createChatDto: CreateChatDto) {
    if(!createChatDto.name || !createChatDto.user) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const findUser = await this.userRepository.findOneBy({id: createChatDto.user});
    if(!findUser) {
      throw new HttpException(`404 Not found user_id: ${createChatDto.user}`, HttpStatus.NOT_FOUND);
    }
    return await this.chatRepository.save({
      name: createChatDto.name,
      create: findUser,
    });
  }
  async findAll() {
    const chat = await this.chatRepository.findAndCount();
    return {
      data: chat[0],
      count: chat[1],
    };
  }
  async findOne(id: number) {
    if(!id) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.chatRepository.findOneBy({ id });
  }
  async update(id: number, updateChatDto: UpdateChatDto) {
    const uchatKeyInUpdate = Object.keys(updateChatDto);
    const chat = await this.chatRepository.findOneBy({ id });
    if(!uchatKeyInUpdate.length) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if(!chat || !id) {
      throw new HttpException(`404 Not found chat`, HttpStatus.NOT_FOUND);
    }
    for(let keys of uchatKeyInUpdate) {
      if(!updateChatDto[keys]) {
        throw new HttpException(`422 Unprocessable emtity. Keys - ${keys}`, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      chat[keys] = updateChatDto[keys];
    }
    return await this.chatRepository.save(chat);
  }
  async remove(id: number) {
    if(!id) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const chat = await this.chatRepository.findOneBy({ id });
    if(!chat) {
      throw new HttpException('404 Not found', HttpStatus.NOT_FOUND);
    }
    return await this.chatRepository.remove(chat);
  }
}
