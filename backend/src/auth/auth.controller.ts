import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleAuth() {
    return undefined;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  googleCallback(@Req() request: { user: { _id: { toString(): string }; email: string; role: 'admin' | 'user'; name: string } }, @Res() response: Response) {
    const frontendUrl = this.configService.get<string>('frontendUrl') ?? 'http://localhost:3000';
    const { accessToken, user } = this.authService.login(request.user);
    const query = new URLSearchParams({
      token: accessToken,
      role: user.role,
      email: user.email,
      name: user.name
    });

    return response.redirect(`${frontendUrl}/account?${query.toString()}`);
  }
}