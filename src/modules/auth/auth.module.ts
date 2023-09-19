import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Connection } from 'mongoose';
import { config } from 'src/modules/auth/auth.config';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { MONGODB_CONNECTION } from 'src/modules/mongodb/mongodb.constants';
import {
  STAFF_MODEL_SCHEMA,
  StaffSchema,
} from 'src/modules/mongodb/schemas/staff.schema';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    // JwtModule.registerAsync({
    //   global: true,
    // }),
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
