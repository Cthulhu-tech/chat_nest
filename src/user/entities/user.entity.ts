import { Chat } from 'src/chat/entities/chat.entity';
import { Token } from 'src/token/entities/token.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @ManyToMany(() => Chat, (chat) => chat.id)
  chat: Chat[];

  @ManyToMany(() => Chat, (chat) => chat.id)
  chat_create: Chat[];
}
