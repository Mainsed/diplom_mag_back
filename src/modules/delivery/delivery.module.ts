import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DeliveryController } from 'src/modules/delivery/delivery.controller';
import { DeliveryService } from 'src/modules/delivery/delivery.service';
import { MONGODB_CONNECTION } from 'src/modules/mongodb/mongodb.constants';
import {
  DELIVERY_MODEL_SCHEMA,
  DeliverySchema,
} from 'src/modules/mongodb/schemas/delivery.schema';
import {
  WAREHOUSE_MODEL_SCHEMA,
  WarehouseSchema,
} from 'src/modules/mongodb/schemas/warehouse.schema';
import { StoreModule } from 'src/modules/store/store.module';

@Module({
  imports: [StoreModule],
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
