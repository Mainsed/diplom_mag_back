import { IStoreSchema } from 'src/modules/mongodb/schemas/store.schema';

export class GetStoreResponse {
  store: IStoreSchema[];
  storeCount: number;
}
