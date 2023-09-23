import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongodbModule } from 'src/modules/mongodb/mongodb.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from 'src/modules/app/app.config';
import { StaffModule } from 'src/modules/staff/staff.module';
import { ClientModule } from 'src/modules/client/client.module';
import { ClothModule } from 'src/modules/cloth/cloth.module';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    MongodbModule,
    AuthModule,
    StaffModule,
    ClientModule,
    ClothModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
