import { Chat } from 'src/chat/entities/chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @ManyToMany(() => Chat, (chat) => chat.id, {
    onDelete: 'CASCADE',
  })
  chat: Chat[];

  @ManyToMany(() => Chat, (chat) => chat.id, {
    onDelete: 'CASCADE',
  })
  chat_create: Chat[];
}
