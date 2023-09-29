import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { ReportController } from '../reports/reports.controller';
import { ReportService } from '../reports/reports.service';
import { MONGODB_CONNECTION } from '../mongodb/mongodb.constants';
import {
  ORDER_MODEL_SCHEMA,
  OrderSchema,
} from '../mongodb/schemas/order.schema';
import {
  STAFF_MODEL_SCHEMA,
  StaffSchema,
} from '../mongodb/schemas/staff.schema';

@Module({
  controllers: [ReportController],
  providers: [
    {
      provide: ORDER_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('order', OrderSchema),
      inject: [MONGODB_CONNECTION],
    },
    {
      provide: STAFF_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('staff', StaffSchema),
      inject: [MONGODB_CONNECTION],
    },
    ReportService,
  ],
})
export class ReportModule {}
