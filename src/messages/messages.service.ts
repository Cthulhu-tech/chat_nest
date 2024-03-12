import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConnectionMessageDto } from './dto/connection.dto';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  connection(ConnectionMessageDto: ConnectionMessageDto) {
    console.log(ConnectionMessageDto);
  }
  async create(createMessageDto: CreateMessageDto, client: Socket) {
    const newMessage = await this.messageRepository.create({
      message: createMessageDto.message,
      user_create: client.data.findUser,
      user_accepted: client.data.findUser,
      chat: client.data.findChat,
    });
    const messageSave = await this.messageRepository.save(newMessage);
    delete messageSave.user_accepted;
    delete messageSave.user_create;
    client.broadcast
      .to(client.data.findChat.id.toString())
      .emit('createMessage', { message: messageSave, room_id: client.data.findChat.id });
    client.emit('createMessage', {
      message: messageSave,
      room_id: client.data.findChat.id,
    });
  }
  async joinChat(ConnectionMessageDto: ConnectionMessageDto, client: Socket) {
    const roomId = ConnectionMessageDto.id.toString();
    await client.join(roomId);
    client.broadcast
      .to(roomId)
      .emit('joinChat', { user: ConnectionMessageDto.login, room_id: roomId });
  }
  async getMessages(
    ConnectionMessageDto: ConnectionMessageDto,
    client: Socket,
  ) {
    const message = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .where('chat.id = :id', {
        id: ConnectionMessageDto.id,
      })
      .getMany();
    client.emit('getMessages', { message, room_id: ConnectionMessageDto.id });
  }
  disconnect(client: Socket) {
    client.broadcast.emit('userDisconect', { user: client.id });
    client.disconnect();
  }
}
