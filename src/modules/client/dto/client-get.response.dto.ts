import { IClientSchema } from '@modules/mongodb/schemas/client.schema';

export class GetClientResponse {
  client: IClientSchema[];
  clientCount: number;
}
