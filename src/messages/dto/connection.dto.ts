import { IsNotEmpty } from "class-validator";

export class ConnectionMessageDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  login: string;
}
