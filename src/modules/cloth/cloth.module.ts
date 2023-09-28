import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { config } from 'src/modules/cloth/cloth.config';
import { ClothController } from 'src/modules/cloth/cloth.controller';
import { ClothService } from 'src/modules/cloth/cloth.service';
import { MONGODB_CONNECTION } from 'src/modules/mongodb/mongodb.constants';
import {
  CLOTH_MODEL_SCHEMA,
  ClothSchema,
} from 'src/modules/mongodb/schemas/cloth.schema';
import {
  WAREHOUSE_MODEL_SCHEMA,
  WarehouseSchema,
} from 'src/modules/mongodb/schemas/warehouse.schema';

@Module({
  imports: [ConfigModule.forFeature(config)],
  controllers: [ClothController],
  providers: [
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
    ClothService,
  ],
  exports: [ClothService],
})
export class ClothModule {}
