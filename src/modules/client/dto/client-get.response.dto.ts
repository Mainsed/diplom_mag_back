import { IClientSchema } from '../../mongodb/schemas/client.schema';

export class GetClientResponse {
  client: IClientSchema[];
  clientCount: number;
}
