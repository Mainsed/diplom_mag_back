import { IDeliverySchema } from '@modules/mongodb/schemas/delivery.schema';

export class GetDeliveryResponse {
  delivery: IDeliverySchema[];
  deliveryCount: number;
}
