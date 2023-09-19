import {
  IsBoolean,
  IsNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { cfgRaw } from 'src/modules/auth/auth.config';

export class LoginRequestDto {
  @IsString()
  @Length(cfgRaw.nameMinLength, cfgRaw.nameMaxLength)
  name: string;

  @IsString()
  @Length(cfgRaw.emailMinLength, cfgRaw.emailMaxLength)
  email: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  @Length(cfgRaw.passwordMinLength, cfgRaw.passwordMaxLength)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  password: string;

  @IsString()
  @Length(cfgRaw.positionMinLength, cfgRaw.positionMaxLength)
  position: string;

  @IsNumber()
  storeId: number;
}
