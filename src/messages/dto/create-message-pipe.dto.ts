import { User } from "src/user/entities/user.entity";
import { CreateMessageDto } from "./create-message.dto";
import { Chat } from "src/chat/entities/chat.entity";

export class CreateMessagePipeDto extends CreateMessageDto {
    userData: User;
    chatData: Chat;
}