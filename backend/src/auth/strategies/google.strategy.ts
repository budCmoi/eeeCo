import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '@/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('google.clientId') || 'missing-google-client-id',
      clientSecret: configService.get<string>('google.clientSecret') || 'missing-google-client-secret',
      callbackURL: configService.get<string>('google.callbackUrl') || 'http://localhost:4000/api/auth/google/callback',
      scope: ['email', 'profile']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const user = await this.authService.validateGoogleUser(profile);
    done(null, user);
  }
}