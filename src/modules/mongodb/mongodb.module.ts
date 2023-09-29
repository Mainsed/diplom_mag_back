import { Global, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../mongodb/mongodb.config';
import { MONGODB_CONNECTION } from '../mongodb/mongodb.constants';

const providers = [
  {
    provide: MONGODB_CONNECTION,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (cfg: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(cfg.getOrThrow('module.mongodb.url'), {
        connectTimeoutMS: cfg.getOrThrow<number>(
          'module.mongodb.connectTimeoutMS',
        ),
        dbName: cfg.getOrThrow<string>('module.mongodb.dbName'),
      }),
  },
];

@Global()
@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [...providers],
  exports: [...providers],
})
export class MongodbModule implements OnModuleDestroy {
  async onModuleDestroy(): Promise<void> {
    Logger.log('Closing MongoDB connection...', MongodbModule.name);
    await mongoose.disconnect();
    Logger.verbose('OK', MongodbModule.name);
  }
}
