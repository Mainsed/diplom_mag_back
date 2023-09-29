import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongodbModule } from '../mongodb/mongodb.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from '../app/app.config';
import { StaffModule } from '../staff/staff.module';
import { ClientModule } from '../client/client.module';
import { ClothModule } from '../cloth/cloth.module';
import { ReportModule } from '../reports/reports.module';
import { OrderModule } from '../order/order.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    MongodbModule,
    AuthModule,
    StaffModule,
    ClientModule,
    ClothModule,
    ReportModule,
    OrderModule,
    StoreModule,
    DeliveryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
