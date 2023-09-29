import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { OrderController } from '../order/order.controller';
import { OrderService } from '../order/order.service';
import { MONGODB_CONNECTION } from '../mongodb/mongodb.constants';
import {
  ORDER_MODEL_SCHEMA,
  OrderSchema,
} from '../mongodb/schemas/order.schema';
import {
  CLOTH_MODEL_SCHEMA,
  ClothSchema,
} from '../mongodb/schemas/cloth.schema';
import {
  WAREHOUSE_MODEL_SCHEMA,
  WarehouseSchema,
} from '../mongodb/schemas/warehouse.schema';

@Module({
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('order', OrderSchema),
      inject: [MONGODB_CONNECTION],
    },
    {
      provide: CLOTH_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('cloth', ClothSchema),
      inject: [MONGODB_CONNECTION],
    },
    {
      provide: WAREHOUSE_MODEL_SCHEMA,
      useFactory: (conn: Connection) =>
        conn.model('warehouse', WarehouseSchema),
      inject: [MONGODB_CONNECTION],
    },
    OrderService,
  ],
})
export class OrderModule {}
