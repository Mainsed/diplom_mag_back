import { IsEnum, IsString, Length } from 'class-validator';
import { cfgRaw } from 'src/modules/client/client.config';
import { ClothSizes } from 'src/shared/enums/cloth-sizes.enum';

export class ClientCreateRequestDto {
  @IsString()
  @Length(cfgRaw.nameMinLength, cfgRaw.nameMaxLength)
  name?: string;

  @IsString()
  @Length(cfgRaw.emailMinLength, cfgRaw.emailMaxLength)
  email?: string;

  @IsString()
  @Length(cfgRaw.phoneNumberMinLength, cfgRaw.phoneNumberMaxLength)
  phoneNumber?: string;

  @IsEnum(ClothSizes)
  size?: ClothSizes;
}
