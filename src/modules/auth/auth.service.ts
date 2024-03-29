import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { Model } from 'mongoose';
import { LoginRequestDto } from '../auth/dto/login.request.dto';
import {
  STAFF_MODEL_SCHEMA,
  IStaffSchema,
} from '../mongodb/schemas/staff.schema';
import md5 from 'md5';
import { LoginResponsetDto } from '../auth/dto/login.response.dto';
import { JwtService } from '@nestjs/jwt';

/**
 * Service that provides auth logic
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
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

        res.cookie('isAuthorized', true, { sameSite: 'none', secure: true });
        res.cookie('userName', user.name, { sameSite: 'none', secure: true });
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          signed: true,
          sameSite: 'none',
          secure: true,
        });

        return { isAuthorized: true, name: user.name, accessToken };
      }
      throw new NotFoundException(
        'Не знайдено користувача, або не правильний пароль',
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  logout(res: Response) {
    try {
      res.clearCookie('isAuthorized');
      res.clearCookie('accessToken');
      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async findAdminUserByEmail(email: string): Promise<IStaffSchema> {
    return this.staffSchema.findOne({ email, deletedBy: null, isAdmin: true });
  }

  private async generateAccessToken(user: IStaffSchema) {
    const token = await this.jwtService.signAsync({
      email: user.email,
      name: user.name,
    });

    return token;
  }
}
