import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';

import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateGoogleUser(profile: Profile) {
    const email = profile.emails?.[0]?.value ?? '';
    const avatar = profile.photos?.[0]?.value;

    return this.usersService.upsertGoogleUser({
      googleId: profile.id,
      email,
      name: profile.displayName,
      avatar
    });
  }

  login(user: { id?: string; _id?: { toString(): string }; email: string; role: 'admin' | 'user'; name: string }) {
    const subject = user.id ?? user._id?.toString() ?? '';
    const accessToken = this.jwtService.sign({
      sub: subject,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return {
      accessToken,
      user
    };
  }
}