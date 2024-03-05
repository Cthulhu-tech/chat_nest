import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket } from "socket.io";
import { createRoomDto } from './dto/createRoom.dto';
import { ConnectionMessageDto } from './dto/connection.dto';

@WebSocketGateway({ cors: '*:*' })
export class MessagesGateway implements OnGatewayDisconnect {
  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('joinChat')
  joinRoom(@MessageBody() ConnectionMessageDto: ConnectionMessageDto, @ConnectedSocket() client: Socket) {
		return this.messagesService.joinChat(ConnectionMessageDto, client);
	}

  @SubscribeMessage('getMessages')
  getMessages(@MessageBody() ConnectionMessageDto: ConnectionMessageDto, @ConnectedSocket() client: Socket) {
		return this.messagesService.getMessages(ConnectionMessageDto, client);
	}

  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() createRoom: createRoomDto) {
    return this.messagesService.createRoom(createRoom);
  }

  handleDisconnect(client: Socket) {
		return this.messagesService.disconnect(client);
	}
}
