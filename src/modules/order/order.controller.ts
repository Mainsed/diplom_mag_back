import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { OrderService } from '@modules/order/order.service';
import { OrderCreateRequestDto } from '@modules/order/dto/order-create.request.dto';
import { UserEmail } from '@shared/decorators/user-email.decorator';
import { GetOrderRequest } from '@modules/order/dto/order-get.request.dto';
import { IOrderSchema } from '@modules/mongodb/schemas/order.schema';
import { OrderUpdateRequestDto } from '@modules/order/dto/order-update.request.dto';

/**
 * Controler to execute orderorization
 * @param {OrderService} orderService - order service instance
 */
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() dto: OrderCreateRequestDto,
    @UserEmail() userEmail: string,
  ) {
    return this.orderService.createOrder(dto, userEmail);
  }

  @Get()
  async getOrder(@Query() dto: GetOrderRequest) {
    return this.orderService.getOrder(dto);
  }

  @Put()
  async updateOrder(
    @Body() dto: OrderUpdateRequestDto,
    @UserEmail() userEmail: string,
  ): Promise<IOrderSchema> {
    return this.orderService.updateOrder(dto, userEmail);
  }

  @Delete()
  async deleteOrder(
    @Query('id') id: number,
    @UserEmail() userEmail: string,
  ): Promise<number> {
    return this.orderService.softDeleteOrder(id, userEmail);
  }
}
