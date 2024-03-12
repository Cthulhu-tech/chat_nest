import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket } from 'socket.io';
import { ConnectionMessageDto } from './dto/connection.dto';
import { UseGuards } from '@nestjs/common';
import { FindChatGuard, FindUserGuard } from './message.guard';

@WebSocketGateway({ cors: '*:*' })
export class MessagesGateway implements OnGatewayDisconnect {
  constructor(private readonly messagesService: MessagesService) {}
  @UseGuards(FindChatGuard)
  @SubscribeMessage('joinChat')
  joinRoom(
    @MessageBody() ConnectionMessageDto: ConnectionMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.joinChat(ConnectionMessageDto, client);
  }
  @SubscribeMessage('getMessages')
  getMessages(
    @MessageBody() ConnectionMessageDto: ConnectionMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.getMessages(ConnectionMessageDto, client);
  }
  @UseGuards(FindUserGuard)
  @UseGuards(FindChatGuard)
  @SubscribeMessage('createMessage')
  create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.create(createMessageDto, client);
  }
  handleDisconnect(client: Socket) {
    return this.messagesService.disconnect(client);
  }
}
