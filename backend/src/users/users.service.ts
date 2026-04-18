import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { serializeUser } from '@/prisma/prisma-mappers';

type GoogleUserPayload = {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertGoogleUser(payload: GoogleUserPayload) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: payload.googleId }, { email: payload.email }]
      }
    });

    if (existingUser) {
      const updatedUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId: payload.googleId,
          name: payload.name,
          avatar: payload.avatar
        }
      });

      return serializeUser(updatedUser);
    }

    const createdUser = await this.prisma.user.create({
      data: {
        ...payload,
        role: payload.email.includes('admin') ? 'admin' : 'user'
      }
    });

    return serializeUser(createdUser);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return serializeUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return users.map(serializeUser);
  }
}