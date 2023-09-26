import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ClothId } from 'src/modules/order/dto/order-create.request.dto';
import { OrderStatuses } from 'src/shared/enums/order-statuses.enum';

export class OrderUpdateRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  clientId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  clothIdList?: ClothId[];

  @IsOptional()
  @IsString()
  @IsEnum(OrderStatuses)
  status?: OrderStatuses;
}
