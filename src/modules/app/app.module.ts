import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongodbModule } from '@modules/mongodb/mongodb.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from '@modules/app/app.config';
import { StaffModule } from '@modules/staff/staff.module';
import { ClientModule } from '@modules/client/client.module';
import { ClothModule } from '@modules/cloth/cloth.module';
import { ReportModule } from '@modules/reports/reports.module';
import { OrderModule } from '@modules/order/order.module';
import { DeliveryModule } from '@modules/delivery/delivery.module';
import { StoreModule } from '@modules/store/store.module';

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
