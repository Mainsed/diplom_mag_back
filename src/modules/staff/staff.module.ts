import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { config } from '@modules/staff/staff.config';
import { StaffController } from '@modules/staff/staff.controller';
import { StaffService } from '@modules/staff/staff.service';
import { MONGODB_CONNECTION } from '@modules/mongodb/mongodb.constants';
import {
  STAFF_MODEL_SCHEMA,
  StaffSchema,
} from '@modules/mongodb/schemas/staff.schema';

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
