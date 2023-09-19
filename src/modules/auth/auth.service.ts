import { Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Model } from 'mongoose';
import { LoginRequestDto } from 'src/modules/auth/dto/login.request.dto';
import {
  STAFF_MODEL_SCHEMA,
  IStaffSchema,
} from 'src/modules/mongodb/schemas/staff.schema';
import * as md5 from 'md5';
import { LoginResponsetDto } from 'src/modules/auth/dto/login.response.dto';
import { JwtService } from '@nestjs/jwt';

/**
 * Service that provides auth logic
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(STAFF_MODEL_SCHEMA)
    private readonly staffSchema: Model<IStaffSchema>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto, res: Response): Promise<LoginResponsetDto> {
    try {
      const password = md5(dto.password);
      const user = await this.staffSchema.findOne({
        email: dto.email,
        password,
        deletedBy: null,
        isAdmin: true,
      });
      if (user) {
        const accessToken = await this.generateAccessToken(user);

        res.cookie('isAuthorized', true);
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          signed: true,
        });

        return { isAuthorized: true, name: user.name };
      }
      throw 'Не знайдено користувача, або не правильний пароль';
    } catch (e) {
      return {
        isAuthorized: false,
        error: e.toString(),
      };
    }
  }

  private async generateAccessToken(user: IStaffSchema) {
    const token = await this.jwtService.signAsync({
      email: user.email,
      name: user.name,
    });

    return token;
  }
}
