import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
