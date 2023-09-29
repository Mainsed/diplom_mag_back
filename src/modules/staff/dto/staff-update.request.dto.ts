import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { cfgRaw } from '../../staff/staff.config';

export class StaffUpdateRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsOptional()
  @IsString()
  @Length(cfgRaw.nameMinLength, cfgRaw.nameMaxLength)
  name?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Length(cfgRaw.emailMinLength, cfgRaw.emailMaxLength)
  email?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  @ValidateIf((obj: any) => obj.isAdmin === true)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'password must be minimum eight characters, at least one letter and one number',
  })
  password?: string;

  @IsOptional()
  @IsString()
  @Length(cfgRaw.positionMinLength, cfgRaw.positionMaxLength)
  position?: string;

  @IsOptional()
  @IsNumber()
  storeId?: number;
}
