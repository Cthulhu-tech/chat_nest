import { PipeTransform, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chat/entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ConnectionMessageDto } from './dto/connection.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ValidationChatPipe implements PipeTransform {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async transform(value: CreateMessageDto) {
    const chatData = await this.chatRepository.findOneBy({
      id: value.chat,
    });
    const userData = await this.userRepository.findOneBy({
      id: value.user_create,
    });
    if (chatData && userData) {
      return {
        ...value,
        chatData,
        userData,
      };
    }
    throw new WsException('Chat not found');
  }
}

@Injectable()
export class ValidationChatConnectionPipe implements PipeTransform {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}
  async transform(value: ConnectionMessageDto) {
    const chat = await this.chatRepository.findOneBy({
      id: value.id,
    });
    if (chat) {
      return value;
    }
    throw new WsException('Chat not found');
  }
}
