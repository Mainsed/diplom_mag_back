import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { cfgRaw } from 'src/modules/staff/staff.config';

export class StaffCreateRequestDto {
  @IsString()
  @Length(cfgRaw.nameMinLength, cfgRaw.nameMaxLength)
  name: string;

  @IsString()
  @IsEmail()
  @Length(cfgRaw.emailMinLength, cfgRaw.emailMaxLength)
  email: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  @ValidateIf((obj: any) => obj.isAdmin === true)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'password must be minimum eight characters, at least one letter and one number',
  })
  password?: string;

  @IsString()
  @Length(cfgRaw.positionMinLength, cfgRaw.positionMaxLength)
  position: string;

  @IsNumber()
  storeId: number;
}
