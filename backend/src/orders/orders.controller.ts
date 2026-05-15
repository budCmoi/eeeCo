import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OrdersService } from '@/orders/orders.service';
import { CreateOrderDto } from '@/orders/dto/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('demo')
  create(@Req() req: { user: { sub: string } }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req: { user: { sub: string } }) {
    return this.ordersService.findForUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.ordersService.findOne(id, req.user.sub);
  }
}
