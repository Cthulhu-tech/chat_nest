import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConnectionMessageDto } from './dto/connection.dto';
import { createRoomDto } from './dto/createRoom.dto';
import { Socket } from 'socket.io';
import { Chat } from 'src/chat/entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  connection(ConnectionMessageDto: ConnectionMessageDto) {
    console.log(ConnectionMessageDto)
  }

  create(createMessageDto: CreateMessageDto) {

  }

  createRoom(createRoomDto: createRoomDto) {

  }

  async joinChat(ConnectionMessageDto: ConnectionMessageDto, client: Socket) {
    const room_id = ConnectionMessageDto.id.toString();
    await client.join(room_id);
    client.broadcast
      .to(room_id)
      .emit('joinChat', { user: ConnectionMessageDto.login, room_id });
  }

  async getMessages(ConnectionMessageDto: ConnectionMessageDto, client: Socket) {
    const message = await this.messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.chat", "chat")
    .where("chat.id = :id", {
      id: ConnectionMessageDto.id,
    })
    .getMany();
    client.emit("getMessages", {message, id: ConnectionMessageDto.id});
  }

	disconnect(client: Socket) {
		client.broadcast.emit("userDisconect", { user: client.id });
		client.disconnect();
	}
}
