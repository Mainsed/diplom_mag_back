import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { config } from 'src/modules/client/client.config';
import { ClientController } from 'src/modules/client/client.controller';
import { ClientService } from 'src/modules/client/client.service';
import { MONGODB_CONNECTION } from 'src/modules/mongodb/mongodb.constants';
import {
  CLIENT_MODEL_SCHEMA,
  ClientSchema,
} from 'src/modules/mongodb/schemas/client.schema';

@Module({
  imports: [ConfigModule.forFeature(config)],
  controllers: [ClientController],
  providers: [
    {
      provide: CLIENT_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('client', ClientSchema),
      inject: [MONGODB_CONNECTION],
    },
    ClientService,
  ],
})
export class ClientModule {}
