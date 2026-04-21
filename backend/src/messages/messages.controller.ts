import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessagesService } from '@/messages/messages.service';
import { CreateConversationDto, SendMessageDto } from '@/messages/dto/create-message.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  getConversations(@CurrentUser() user: { sub: string }) {
    return this.messagesService.getMyConversations(user.sub);
  }

  @Get('unread')
  getUnreadCount(@CurrentUser() user: { sub: string }) {
    return this.messagesService.getUnreadCount(user.sub);
  }

  @Get('conversations/:id')
  getConversation(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: { sub: string }) {
    return this.messagesService.getConversationMessages(id, user.sub);
  }

  @Post('conversations')
  createConversation(@Body() dto: CreateConversationDto, @CurrentUser() user: { sub: string }) {
    return this.messagesService.createConversation(user.sub, dto);
  }

  @Post('conversations/:id/messages')
  sendMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: { sub: string }
  ) {
    return this.messagesService.sendMessage(id, user.sub, dto);
  }
}
