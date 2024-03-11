import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConnectionMessageDto } from './dto/connection.dto';
import { createRoomDto } from './dto/createRoom.dto';
import { Socket } from 'socket.io';
import { Chat } from 'src/chat/entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  connection(ConnectionMessageDto: ConnectionMessageDto) {
    console.log(ConnectionMessageDto)
  }

  async create(createMessageDto: CreateMessageDto, client: Socket) {
    const find_user = await this.userRepository.findOneBy({
      id: createMessageDto.user_create,
    });
    const find_chat = await this.chatRepository.findOneBy({
      id: createMessageDto.chat,
    });
    if(!find_user || !find_chat) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const new_message = await this.messageRepository.create({
      message: createMessageDto.message,
      user_create: find_user,
      user_accepted: find_user,
      chat: find_chat,
    });
    const message_save = await this.messageRepository.save(new_message);
    delete message_save.user_accepted;
    delete message_save.user_create;
    client.broadcast
    .to(find_chat.id.toString())
    .emit('createMessage', { message: message_save, room_id: find_chat.id });
    client
    .emit('createMessage', { message: message_save, room_id: find_chat.id });
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
    client.emit("getMessages", { message, room_id: ConnectionMessageDto.id });
  }
	disconnect(client: Socket) {
		client.broadcast.emit("userDisconect", { user: client.id });
		client.disconnect();
	}
}
