import { IClothSchema } from 'src/modules/mongodb/schemas/cloth.schema';

export class GetClothResponse {
  cloth: IClothSchema[];
  clothCount: number;
}
