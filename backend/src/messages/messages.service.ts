import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateConversationDto, SendMessageDto } from '@/messages/dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: { some: { userId } }
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, avatar: true, email: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    return conversations.map((conv) => ({
      id: conv.id,
      subject: conv.subject,
      lastMessageAt: conv.lastMessageAt,
      participants: conv.participants.map((p) => p.user),
      lastMessage: conv.messages[0] ?? null
    }));
  }

  async getConversationMessages(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
        messages: {
          include: {
            sender: { select: { id: true, name: true, avatar: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isMember = conversation.participants.some((p) => p.userId === userId);

    if (!isMember) {
      throw new ForbiddenException('Access denied');
    }

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        readAt: null,
        senderId: { not: userId }
      },
      data: { readAt: new Date() }
    });

    return {
      id: conversation.id,
      subject: conversation.subject,
      messages: conversation.messages,
      participants: conversation.participants
    };
  }

  async createConversation(senderId: string, dto: CreateConversationDto) {
    // Check if conversation already exists between these two users
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: senderId } } },
          { participants: { some: { userId: dto.recipientId } } }
        ]
      },
      include: { participants: true }
    });

    if (existing) {
      // Add message to existing conversation
      const message = await this.prisma.message.create({
        data: {
          conversationId: existing.id,
          senderId,
          content: dto.firstMessage
        },
        include: { sender: { select: { id: true, name: true, avatar: true } } }
      });

      await this.prisma.conversation.update({
        where: { id: existing.id },
        data: { lastMessageAt: new Date() }
      });

      return { conversationId: existing.id, message };
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        subject: dto.subject,
        lastMessageAt: new Date(),
        participants: {
          create: [{ userId: senderId }, { userId: dto.recipientId }]
        },
        messages: {
          create: {
            senderId,
            content: dto.firstMessage
          }
        }
      },
      include: {
        messages: {
          include: { sender: { select: { id: true, name: true, avatar: true } } }
        }
      }
    });

    return {
      conversationId: conversation.id,
      message: conversation.messages[0]
    };
  }

  async sendMessage(conversationId: string, senderId: string, dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true }
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isMember = conversation.participants.some((p) => p.userId === senderId);

    if (!isMember) {
      throw new ForbiddenException('Access denied');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: dto.content
      },
      include: { sender: { select: { id: true, name: true, avatar: true } } }
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    return message;
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        readAt: null,
        senderId: { not: userId },
        conversation: {
          participants: { some: { userId } }
        }
      }
    });

    return { unreadCount: count };
  }
}
