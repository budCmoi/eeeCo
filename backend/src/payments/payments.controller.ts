import { Body, Controller, Post } from '@nestjs/common';

import { CreateCheckoutSessionDto } from '@/payments/dto/create-checkout-session.dto';
import { PaymentsService } from '@/payments/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-session')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto) {
    return this.paymentsService.createCheckoutSession(dto);
  }
}