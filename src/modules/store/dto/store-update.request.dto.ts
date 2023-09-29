import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { cfgRaw } from '@modules/store/store.config';

export class StoreUpdateRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  @Length(cfgRaw.addressMinLength, cfgRaw.addressMaxLength)
  address?: string;
}
