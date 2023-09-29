import { Transform } from 'class-transformer';
import { IsNumber, ValidateIf } from 'class-validator';
import { DeliveryType } from '@shared/enums/delivery-type.enum';

export class DeliveryUpdateRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @ValidateIf((obj: any) => obj.typeOfDelivery === DeliveryType.EXTERNAL)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price?: number;
}
