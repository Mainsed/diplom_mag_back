import { IClientSchema } from 'src/modules/mongodb/schemas/client.schema';

export class GetClientResponse {
  client: IClientSchema[];
  clientCount: number;
}
