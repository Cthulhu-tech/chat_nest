import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user_create: User;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user_accepted: User;

  @OneToOne(() => Chat, (chat) => chat.id)
  @JoinColumn()
  chat: Chat;
}
