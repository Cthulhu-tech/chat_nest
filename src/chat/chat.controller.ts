import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateChatPipeDto } from './dto/create-chat-pipe';
import { ValidationCreateChatDTOPipe } from './chat.pipes';

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
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
