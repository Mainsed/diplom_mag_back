import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IClothId } from 'src/modules/mongodb/schemas/order.schema';
import { ClothSizes } from 'src/shared/enums/cloth-sizes.enum';
import { OrderStatuses } from 'src/shared/enums/order-statuses.enum';

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
  @ValidateNested({ each: true })
  clothIdList?: ClothId[];

  @IsString()
  @IsEnum(OrderStatuses)
  status?: OrderStatuses;
}
