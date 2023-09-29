import { IOrderSchema } from '@modules/mongodb/schemas/order.schema';

export class GetOrderResponse {
  order: IOrderSchema[];
  orderCount: number;
}
