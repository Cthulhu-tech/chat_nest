import { User } from "src/user/entities/user.entity";
import { CreateChatDto } from "./create-chat.dto";

export class CreateChatPipeDto extends CreateChatDto {
    userData: User;
}

