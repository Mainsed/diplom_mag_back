import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { cfgRaw } from 'src/modules/client/client.config';
import { ClothSizes } from 'src/shared/enums/cloth-sizes.enum';

export class ClientUpdateRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsOptional()
  @IsString()
  @Length(cfgRaw.nameMinLength, cfgRaw.nameMaxLength)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(cfgRaw.emailMinLength, cfgRaw.emailMaxLength)
  email?: string;

  @IsOptional()
  @IsString()
  @Length(cfgRaw.phoneNumberMinLength, cfgRaw.phoneNumberMaxLength)
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(ClothSizes)
  size?: ClothSizes;
}
