import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import { OrdersService } from '@/orders/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() request: { user: { sub: string } }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(request.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyOrders(@Req() request: { user: { sub: string } }) {
    return this.ordersService.findMyOrders(request.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/overview')
  getOverview() {
    return this.ordersService.getOverview();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
}