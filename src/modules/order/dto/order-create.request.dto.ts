import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IClothId } from '@modules/mongodb/schemas/order.schema';
import { ClothSizes } from '@shared/enums/cloth-sizes.enum';
import { OrderStatuses } from '@shared/enums/order-statuses.enum';

export class ClothId implements IClothId {
  @IsNumber()
  clothId: number;

  @IsNumber()
  amount: number;

  @IsEnum(ClothSizes)
  size: ClothSizes;
}

export class OrderCreateRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  clientId?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ClothId)
  clothIdList?: ClothId[];

  @IsString()
  @IsEnum(OrderStatuses)
  status?: OrderStatuses;
}
