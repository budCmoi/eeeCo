import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    const msg = await this.prisma.contactMessage.create({ data: dto });
    return {
      message: 'Votre message a bien été envoyé. Nous vous répondrons sous 24h.',
      id: msg.id
    };
  }
}
