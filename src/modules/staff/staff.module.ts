import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { config } from '../staff/staff.config';
import { StaffController } from '../staff/staff.controller';
import { StaffService } from '../staff/staff.service';
import { MONGODB_CONNECTION } from '../mongodb/mongodb.constants';
import {
  STAFF_MODEL_SCHEMA,
  StaffSchema,
} from '../mongodb/schemas/staff.schema';

@Module({
  imports: [ConfigModule.forFeature(config)],
  controllers: [StaffController],
  providers: [
    {
      provide: STAFF_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('staff', StaffSchema),
      inject: [MONGODB_CONNECTION],
    },
    StaffService,
  ],
})
export class StaffModule {}
