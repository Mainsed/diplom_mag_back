import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Connection } from 'mongoose';
import { config } from '../auth/auth.config';
import { AuthController } from '../auth/auth.controller';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { MONGODB_CONNECTION } from '../mongodb/mongodb.constants';
import {
  STAFF_MODEL_SCHEMA,
  StaffSchema,
} from '../mongodb/schemas/staff.schema';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(config)],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
        },
        secret: configService.getOrThrow('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: STAFF_MODEL_SCHEMA,
      useFactory: (conn: Connection) => conn.model('staff', StaffSchema),
      inject: [MONGODB_CONNECTION],
    },
    AuthService,
  ],
})
export class AuthModule {}
