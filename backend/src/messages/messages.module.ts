import { Module } from '@nestjs/common';

import { MessagesController } from '@/messages/messages.controller';
import { MessagesService } from '@/messages/messages.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}
