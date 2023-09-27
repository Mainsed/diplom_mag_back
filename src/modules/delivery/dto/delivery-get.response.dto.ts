import { IDeliverySchema } from 'src/modules/mongodb/schemas/delivery.schema';

export class GetDeliveryResponse {
  delivery: IDeliverySchema[];
  deliveryCount: number;
}
