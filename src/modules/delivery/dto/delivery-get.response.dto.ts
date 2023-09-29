import { IDeliverySchema } from '../../mongodb/schemas/delivery.schema';

export class GetDeliveryResponse {
  delivery: IDeliverySchema[];
  deliveryCount: number;
}
