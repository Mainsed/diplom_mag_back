import { IStoreSchema } from '../../mongodb/schemas/store.schema';

export class GetStoreResponse {
  store: IStoreSchema[];
  storeCount: number;
}
