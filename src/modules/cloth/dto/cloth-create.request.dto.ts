import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { cfgRaw } from 'src/modules/cloth/cloth.config';
import { ClothSizes } from 'src/shared/enums/cloth-sizes.enum';

export class ClothCreateRequestDto {
  @IsString()
  @Length(cfgRaw.nameMinLength, cfgRaw.nameMaxLength)
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @Length(cfgRaw.descMinLength, cfgRaw.descMaxLength)
  desc: string;

  @IsEnum(ClothSizes, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  availableSizes: ClothSizes[];
}
