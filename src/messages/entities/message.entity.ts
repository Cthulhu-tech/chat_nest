import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user_create: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user_accepted: User;

  @ManyToOne(() => Chat, (chat) => chat.id)
  @JoinColumn()
  chat: Chat;
}
