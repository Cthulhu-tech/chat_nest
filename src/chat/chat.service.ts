import { Injectable } from '@nestjs/common';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatPipeDto } from './dto/create-chat-pipe.dto';

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
  async update(chat: Chat, updateChatDto: UpdateChatDto) {
    const updateChatKey = Object.keys(updateChatDto);
    for (const keys of updateChatKey) {
      chat[keys] = updateChatDto[keys];
    }
    return await this.chatRepository.save(chat);
  }
  async remove(chat: Chat) {
    return await this.chatRepository.remove(chat);
  }
}
