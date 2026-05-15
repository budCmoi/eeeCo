import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() req: { user: { sub: string } }) {
    return this.profileService.findByUserId(req.user.sub);
  }

  @Put()
  updateProfile(
    @Req() req: { user: { sub: string } },
    @Body() dto: UpdateProfileDto
  ) {
    return this.profileService.update(req.user.sub, dto);
  }

  @Post('addresses')
  addAddress(@Req() req: { user: { sub: string } }, @Body() body: unknown) {
    return this.profileService.addAddress(req.user.sub, body as Parameters<ProfileService['addAddress']>[1]);
  }

  @Delete('addresses/:id')
  removeAddress(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.profileService.removeAddress(req.user.sub, id);
  }

  @Post('payment-methods')
  addPaymentMethod(@Req() req: { user: { sub: string } }, @Body() body: unknown) {
    return this.profileService.addPaymentMethod(req.user.sub, body as Parameters<ProfileService['addPaymentMethod']>[1]);
  }

  @Delete('payment-methods/:id')
  removePaymentMethod(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.profileService.removePaymentMethod(req.user.sub, id);
  }
}
