import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { serializeUser } from '@/prisma/prisma-mappers';

type GoogleUserPayload = {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
};

type LocalUserPayload = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createLocalUser(payload: LocalUserPayload) {
    const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: 'user'
      }
    });

    return serializeUser(user);
  }

  async findByEmailWithPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ?? null;
  }

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

  async updateProfile(id: string, data: { name?: string; bio?: string; phone?: string; avatar?: string; isSeller?: boolean }) {
    const user = await this.prisma.user.update({
      where: { id },
      data
    });

    return serializeUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return users.map(serializeUser);
  }
}