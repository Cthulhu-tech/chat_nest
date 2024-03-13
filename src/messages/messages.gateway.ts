import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Socket } from 'socket.io';
import { ConnectionMessageDto } from './dto/connection.dto';
import {
  ValidationChatConnectionPipe,
  ValidationChatPipe,
} from './mesages.pipes';
import { CreateMessagePipeDto } from './dto/create-message-pipe.dto';

@WebSocketGateway({ cors: '*:*' })
export class MessagesGateway implements OnGatewayDisconnect {
  constructor(private readonly messagesService: MessagesService) {}
  @SubscribeMessage('joinChat')
  joinRoom(
    @MessageBody(ValidationChatConnectionPipe)
    connectionMessageDto: ConnectionMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.joinChat(connectionMessageDto, client);
  }
  @SubscribeMessage('getMessages')
  getMessages(
    @MessageBody() ConnectionMessageDto: ConnectionMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.getMessages(ConnectionMessageDto, client);
  }
  @SubscribeMessage('createMessage')
  create(
    @MessageBody(ValidationChatPipe) createMessagePipeDto: CreateMessagePipeDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.create(createMessagePipeDto, client);
  }
  handleDisconnect(client: Socket) {
    return this.messagesService.disconnect(client);
  }
}
