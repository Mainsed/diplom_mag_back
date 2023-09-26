import { IOrderSchema } from 'src/modules/mongodb/schemas/order.schema';

export class GetOrderResponse {
  order: IOrderSchema[];
  orderCount: number;
}
