import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { config } from '../store/store.config';
import { StoreController } from '../store/store.controller';
import { StoreService } from '../store/store.service';
import { MONGODB_CONNECTION } from '../mongodb/mongodb.constants';
import {
  STORE_MODEL_SCHEMA,
  StoreSchema,
} from '../mongodb/schemas/store.schema';

@Module({
  imports: [ConfigModule.forFeature(config)],
  controllers: [StoreController],
  providers: [
    {
      provide: STORE_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('store', StoreSchema),
      inject: [MONGODB_CONNECTION],
    },
    StoreService,
  ],
  exports: [StoreService],
})
export class StoreModule {}
