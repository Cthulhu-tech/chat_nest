import { Injectable } from '@nestjs/common';
import { ConnectionMessageDto } from './dto/connection.dto';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessagePipeDto } from './dto/create-message-pipe.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  connection(connectionMessageDto: ConnectionMessageDto) {
    console.log(connectionMessageDto);
  }
  async create(createMessagePipeDto: CreateMessagePipeDto, client: Socket) {
    const newMessage = await this.messageRepository.create({
      message: createMessagePipeDto.message,
      user_create: createMessagePipeDto.userData,
      user_accepted: createMessagePipeDto.userData,
      chat: createMessagePipeDto.chatData,
    });
    const messageSave = await this.messageRepository.save(newMessage);
    delete messageSave.user_accepted;
    delete messageSave.user_create;
    client.broadcast
      .to(createMessagePipeDto.chatData.id.toString())
      .emit('createMessage', { message: messageSave, room_id: createMessagePipeDto.chatData.id });
    client.emit('createMessage', {
      message: messageSave,
      room_id: createMessagePipeDto.chatData.id,
    });
  }
  async joinChat(connectionMessageDto: ConnectionMessageDto, client: Socket) {
    const roomId = connectionMessageDto.id.toString();
    await client.join(roomId);
    client.broadcast
      .to(roomId)
      .emit('joinChat', { user: connectionMessageDto.login, room_id: roomId });
  }
  async getMessages(
    connectionMessageDto: ConnectionMessageDto,
    client: Socket,
  ) {
    const message = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .where('chat.id = :id', {
        id: connectionMessageDto.id,
      })
      .getMany();
    client.emit('getMessages', { message, room_id: connectionMessageDto.id });
  }
  disconnect(client: Socket) {
    client.broadcast.emit('userDisconect', { user: client.id });
    client.disconnect();
  }
}
