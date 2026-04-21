import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';
import * as bcrypt from 'bcrypt';

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

  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.usersService.createLocalUser({ name, email, password: hashedPassword });
    return this.login(user);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  login(user: { id?: string; _id?: string; email: string; role: 'admin' | 'user'; name: string }) {
    const subject = user.id ?? user._id ?? '';
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
