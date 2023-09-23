import { ClothSizes } from 'src/shared/enums/cloth-sizes.enum';

class IClothSizeCount {
  size: ClothSizes;
  count: number;
}

export class IClothSizesInShop {
  sizes: IClothSizeCount[];
  shopId: number;
}

export class IClothSizesInShops {
  shops: IClothSizesInShop[];
  clothId: number;
}
