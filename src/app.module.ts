import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { OrmModule } from './orm/orm.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ChatModule,
    TokenModule,
    OrmModule,
    UserModule,
    ConfigModule.forRoot({ cache: true, ignoreEnvFile: false, isGlobal: true }),
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
