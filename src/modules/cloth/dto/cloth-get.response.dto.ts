import { IClothSchema } from '../../mongodb/schemas/cloth.schema';

export class GetClothResponse {
  cloth: IClothSchema[];
  clothCount: number;
}
