import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IClothId } from 'src/modules/mongodb/schemas/order.schema';
import { OrderStatuses } from 'src/shared/enums/order-statuses.enum';
import { EnumSort } from 'src/shared/enums/sort.enum';

export class GetOrderRequest {
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
  clientId?: number;

  @IsOptional()
  @IsString()
  @IsEnum(OrderStatuses)
  status?: OrderStatuses;
}
