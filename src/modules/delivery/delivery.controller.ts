import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { DeliveryService } from '@modules/delivery/delivery.service';
import { DeliveryCreateRequestDto } from '@modules/delivery/dto/delivery-create.request.dto';
import { UserEmail } from '@shared/decorators/user-email.decorator';
import { GetDeliveryRequest } from '@modules/delivery/dto/delivery-get.request.dto';
import { IDeliverySchema } from '@modules/mongodb/schemas/delivery.schema';
import { DeliveryUpdateRequestDto } from '@modules/delivery/dto/delivery-update.request.dto';

/**
 * Controler to execute deliveryorization
 * @param {DeliveryService} deliveryService - delivery service instance
 */
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  async createDelivery(
    @Body() dto: DeliveryCreateRequestDto,
    @UserEmail() userEmail: string,
  ) {
    return this.deliveryService.createDelivery(dto, userEmail);
  }

  @Get()
  async getDelivery(@Query() dto: GetDeliveryRequest) {
    return this.deliveryService.getDelivery(dto);
  }

  @Put()
  async updateDelivery(
    @Body() dto: DeliveryUpdateRequestDto,
    @UserEmail() userEmail: string,
  ): Promise<IDeliverySchema> {
    return this.deliveryService.updateDelivery(dto, userEmail);
  }

  @Delete()
  async deleteDelivery(
    @Query('id') id: number,
    @UserEmail() userEmail: string,
  ): Promise<number> {
    return this.deliveryService.softDeleteDelivery(id, userEmail);
  }
}
