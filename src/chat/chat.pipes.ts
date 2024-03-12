import { PipeTransform, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ValidationCreateChatDTOPipe implements PipeTransform {
    constructor( @InjectRepository(User) private readonly userRepository: Repository<User>){}
  async transform(value: CreateChatDto) {
    const userData = await this.userRepository.findOneBy({
        id: value.user,
      });
      if (!userData) {
        throw new HttpException(
          `404 Not found user_id: ${value.user}`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        ...value,
        userData
    };
    }
}
