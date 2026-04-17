import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from '@/config/configuration';
import { resolveDatabaseUri } from '@/config/database';
import { validationSchema } from '@/config/validation';
import { AuthModule } from '@/auth/auth.module';
import { HealthController } from '@/health.controller';
import { OrdersModule } from '@/orders/orders.module';
import { PaymentsModule } from '@/payments/payments.module';
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
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: await resolveDatabaseUri({
          configuredUri: configService.get<string>('database.uri'),
          useInMemory: configService.get<boolean>('database.useInMemory')
        })
      })
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    UploadsModule
  ]
})
export class AppModule {}