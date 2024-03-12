import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatPipeDto } from './dto/create-chat-pipe';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}
  async create(createChatDto: CreateChatPipeDto) {
    return await this.chatRepository.save({
      name: createChatDto.name,
      create: createChatDto.userData,
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
    return await this.chatRepository.findOneBy({ id });
  }
  async update(id: number, updateChatDto: UpdateChatDto) {
    const updateChatKey = Object.keys(updateChatDto);
    const chat = await this.chatRepository.findOneBy({ id });
    if (!updateChatKey.length) {
      throw new HttpException(
        '422 Unprocessable entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!chat) {
      throw new HttpException(`404 Not found chat`, HttpStatus.NOT_FOUND);
    }
    for (const keys of updateChatKey) {
      if (!updateChatDto[keys]) {
        throw new HttpException(
          `422 Unprocessable entity. Keys - ${keys}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      chat[keys] = updateChatDto[keys];
    }
    return await this.chatRepository.save(chat);
  }
  async remove(id: number) {
    const chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      throw new HttpException('404 Not found', HttpStatus.NOT_FOUND);
    }
    return await this.chatRepository.remove(chat);
  }
}
