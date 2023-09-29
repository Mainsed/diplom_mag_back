import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ClothSizes } from '../../../shared/enums/cloth-sizes.enum';
import { EnumSort } from '../../../shared/enums/sort.enum';

export class GetClientRequest {
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
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(ClothSizes)
  size?: ClothSizes;
}
