import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { ClothModule } from '../cloth/cloth.module';
import { DeliveryController } from '../delivery/delivery.controller';
import { DeliveryService } from '../delivery/delivery.service';
import { MONGODB_CONNECTION } from '../mongodb/mongodb.constants';
import {
  DELIVERY_MODEL_SCHEMA,
  DeliverySchema,
} from '../mongodb/schemas/delivery.schema';
import {
  WAREHOUSE_MODEL_SCHEMA,
  WarehouseSchema,
} from '../mongodb/schemas/warehouse.schema';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [StoreModule, ClothModule],
  controllers: [DeliveryController],
  providers: [
    {
      provide: DELIVERY_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('delivery', DeliverySchema),
      inject: [MONGODB_CONNECTION],
    },
    {
      provide: WAREHOUSE_MODEL_SCHEMA,
      useFactory: (conn: Connection) =>
        conn.model('warehouse', WarehouseSchema),
      inject: [MONGODB_CONNECTION],
    },
    DeliveryService,
  ],
})
export class DeliveryModule {}
