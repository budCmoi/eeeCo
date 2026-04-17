import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { UploadsService } from '@/uploads/uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('sign')
  createSignature(@Body('folder') folder?: string) {
    return this.uploadsService.createSignature(folder);
  }
}