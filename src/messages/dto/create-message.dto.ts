import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  chat: number;
  @IsNotEmpty()
  user_create: number;
}
