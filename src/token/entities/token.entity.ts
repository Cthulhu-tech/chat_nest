import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refresh: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE"
})
  @JoinTable()
  user: User;
}
