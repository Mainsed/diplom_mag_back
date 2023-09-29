import { IsBoolean, IsString, Length } from 'class-validator';
import { cfgRaw } from '../../store/store.config';

export class StoreCreateRequestDto {
  @IsString()
  @Length(cfgRaw.addressMinLength, cfgRaw.addressMaxLength)
  address?: string;

  @IsBoolean()
  isActive: boolean;
}
