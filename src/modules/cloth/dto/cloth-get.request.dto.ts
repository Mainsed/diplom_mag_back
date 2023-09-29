import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ClothSizes } from '../../../shared/enums/cloth-sizes.enum';
import { EnumSort } from '../../../shared/enums/sort.enum';

export class GetClothRequest {
  @IsNumber()
  @Transform(({ value }) => Number(value) || 10)
  limit: number;

  @IsNumber()
  @Transform(({ value }) => Number(value) || 0)
  page: number;

  @IsOptional()
  @IsEnum(EnumSort)
  order?: EnumSort;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id?: number;

  @IsOptional()
  @IsNumber()
  priceFrom?: string;

  @IsOptional()
  @IsNumber()
  priceTo: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsEnum(ClothSizes)
  @ValidateNested({ each: true })
  availableSizes?: ClothSizes[];
}
