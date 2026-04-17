import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '@/users/schemas/user.schema';

type GoogleUserPayload = {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async upsertGoogleUser(payload: GoogleUserPayload) {
    const existingUser = await this.userModel.findOne({ $or: [{ googleId: payload.googleId }, { email: payload.email }] });

    if (existingUser) {
      existingUser.googleId = payload.googleId;
      existingUser.name = payload.name;
      existingUser.avatar = payload.avatar;
      await existingUser.save();
      return existingUser;
    }

    return this.userModel.create({
      ...payload,
      role: payload.email.includes('admin') ? 'admin' : 'user'
    });
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findAll() {
    return this.userModel.find().sort({ createdAt: -1 });
  }
}