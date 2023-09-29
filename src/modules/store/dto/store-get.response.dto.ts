import { IStoreSchema } from '@modules/mongodb/schemas/store.schema';

export class GetStoreResponse {
  store: IStoreSchema[];
  storeCount: number;
}
