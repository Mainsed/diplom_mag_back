import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { OrderController } from 'src/modules/order/order.controller';
import { OrderService } from 'src/modules/order/order.service';
import { MONGODB_CONNECTION } from 'src/modules/mongodb/mongodb.constants';
import {
  ORDER_MODEL_SCHEMA,
  OrderSchema,
} from 'src/modules/mongodb/schemas/order.schema';
import {
  CLOTH_MODEL_SCHEMA,
  ClothSchema,
} from 'src/modules/mongodb/schemas/cloth.schema';

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
    OrderService,
  ],
})
export class OrderModule {}
