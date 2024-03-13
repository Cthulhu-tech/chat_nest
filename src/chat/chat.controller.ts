import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateChatPipeDto } from './dto/create-chat-pipe.dto';
import { ValidationChatDTOPipe, ValidationCreateChatDTOPipe, ValidationFindChatDTOPipe } from './chat.pipes';
import { Chat } from './entities/chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post()
  create(@Body(ValidationCreateChatDTOPipe) createChatDto: CreateChatPipeDto) {
    return this.chatService.create(createChatDto);
  }
  @Get()
  findAll() {
    return this.chatService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(id);
  }
  @Patch(':id')
  update(
    @Param(ValidationFindChatDTOPipe) chat: Chat,
    @Body(ValidationChatDTOPipe) updateChatDto: UpdateChatDto
  ) {
    return this.chatService.update(chat, updateChatDto);
  }
  @Delete(':id')
  remove(@Param(ValidationFindChatDTOPipe) chat: Chat) {
    return this.chatService.remove(chat);
  }
}
