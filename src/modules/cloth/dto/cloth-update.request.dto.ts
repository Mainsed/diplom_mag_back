import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { cfgRaw } from '../../cloth/cloth.config';
import { ClothSizes } from '../../../shared/enums/cloth-sizes.enum';

export class ClothUpdateRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  @Length(cfgRaw.descMinLength, cfgRaw.descMaxLength)
  desc?: string;

  @IsOptional()
  @IsEnum(ClothSizes)
  @ValidateNested({ each: true })
  availableSizes?: ClothSizes[];
}
