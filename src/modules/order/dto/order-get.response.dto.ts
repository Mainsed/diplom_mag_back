import { IOrderSchema } from '../../mongodb/schemas/order.schema';

export class GetOrderResponse {
  order: IOrderSchema[];
  orderCount: number;
}
