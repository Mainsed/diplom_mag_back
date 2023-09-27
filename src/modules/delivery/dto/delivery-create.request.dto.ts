import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  IClothDelivered,
  IDeliverySizeCount,
} from 'src/modules/mongodb/schemas/delivery.schema';
import { ClothSizes } from 'src/shared/enums/cloth-sizes.enum';
import { DeliveryType } from 'src/shared/enums/delivery-type.enum';

export class DeliverySizeCount implements IDeliverySizeCount {
  @IsEnum(ClothSizes)
  size: ClothSizes;

  @IsNumber()
  count: number;
}

export class ClothDelivered implements IClothDelivered {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DeliverySizeCount)
  sizes: DeliverySizeCount[];

  @IsNumber()
  clothId: number;
}

export class DeliveryCreateRequestDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  deliveredTo: number;

  @ValidateIf((obj: any) => obj.typeOfDelivery === DeliveryType.INTERNAL)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  deliveredFrom?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  totalAmountDelivered: number;

  @IsEnum(DeliveryType)
  typeOfDelivery: DeliveryType;

  @ValidateIf((obj: any) => obj.typeOfDelivery === DeliveryType.EXTERNAL)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ClothDelivered)
  clothDelivered: ClothDelivered[];
}
