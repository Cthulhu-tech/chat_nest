import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat/entities/chat.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Token } from 'src/token/entities/token.entity';
import { User } from 'src/user/entities/user.entity';

export const OrmModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config) => ({
    type: config.get('TYPE') as any,
    host: config.get('HOST'),
    port: Number.parseInt(config.get('PORT')),
    username: config.get('USERNAME'),
    password: config.get('PASSWORD'),
    database: config.get('DATABASE'),
    entities: [User, Token, Chat, Message],
    synchronize: true,
    dropSchema: true
  }),
});
