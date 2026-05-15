import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import configuration from '@/config/configuration';
import { validationSchema } from '@/config/validation';
import { AuthModule } from '@/auth/auth.module';
import { HealthController } from '@/health.controller';
import { OrdersModule } from '@/orders/orders.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductsModule } from '@/products/products.module';
import { UsersModule } from '@/users/users.module';
import { ContactModule } from './contact/contact.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    ContactModule,
    ProfileModule
  ]
})
export class AppModule {}
