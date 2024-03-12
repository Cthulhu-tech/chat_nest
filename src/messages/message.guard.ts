import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateMessageDto } from './dto/create-message.dto';
import { Chat } from 'src/chat/entities/chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Socket } from 'socket.io';

@Injectable()
export class FindChatGuard implements CanActivate {
  constructor(    @InjectRepository(Chat)
  private readonly chatRepository: Repository<Chat>,){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient<Socket<{}, {}, {}, CreateMessageDto>>();

    return new Promise(async (resolve) => {
      const findChat = await this.chatRepository.findOneBy({
        id: client.data.chat,
      });
      context.switchToWs().getClient<Socket>().data.findChat = findChat;
      if(findChat) {
        return resolve(true);
      }
      return resolve(false);
    });
  }
}

@Injectable()
export class FindUserGuard implements CanActivate {
  constructor(    @InjectRepository(User)
  private readonly userRepository: Repository<User>,){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient<Socket<{}, {}, {}, CreateMessageDto>>();
    return new Promise(async (resolve) => {
      const findUser = await this.userRepository.findOneBy({
        id: client.data.user_create,
      });
      context.switchToWs().getClient<Socket>().data.findUser = findUser;
      if(findUser) {
        return resolve(true);
      }
      return resolve(false);
    });
  }
}

