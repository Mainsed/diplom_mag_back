import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EnumSort } from '../../../shared/enums/sort.enum';

export class GetDeliveryRequest {
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
  @Transform(({ value }) => Number(value))
  deliveredTo?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  deliveredFrom?: number;
}
