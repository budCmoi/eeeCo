import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Response } from 'express';

import { AuthService } from '@/auth/auth.service';

class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.name, dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateLocalUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleAuth() {
    return undefined;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  googleCallback(@Req() request: { user: { id?: string; _id?: string; email: string; role: 'admin' | 'user'; name: string } }, @Res() response: Response) {
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
