import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { config } from '../client/client.config';
import { ClientController } from '../client/client.controller';
import { ClientService } from '../client/client.service';
import { MONGODB_CONNECTION } from '../mongodb/mongodb.constants';
import {
  CLIENT_MODEL_SCHEMA,
  ClientSchema,
} from '../mongodb/schemas/client.schema';

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
