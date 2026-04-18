import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from '@/config/configuration';
import { validationSchema } from '@/config/validation';
import { AuthModule } from '@/auth/auth.module';
import { HealthController } from '@/health.controller';
import { OrdersModule } from '@/orders/orders.module';
import { PaymentsModule } from '@/payments/payments.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductsModule } from '@/products/products.module';
import { UploadsModule } from '@/uploads/uploads.module';
import { UsersModule } from '@/users/users.module';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    UploadsModule
  ]
})
export class AppModule {}