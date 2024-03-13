import { IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  password: string;
}
