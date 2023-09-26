import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ClothId, OrderCreateRequestDto } from 'src/modules/order/dto/order-create.request.dto';
import { GetOrderRequest } from 'src/modules/order/dto/order-get.request.dto';
import { GetOrderResponse } from 'src/modules/order/dto/order-get.response.dto';
import { OrderUpdateRequestDto } from 'src/modules/order/dto/order-update.request.dto';
import {
  ORDER_MODEL_SCHEMA,
  IOrderSchema,
} from 'src/modules/mongodb/schemas/order.schema';
import { EnumSort } from 'src/shared/enums/sort.enum';
import {
  CLOTH_MODEL_SCHEMA,
  IClothSchema,
} from 'src/modules/mongodb/schemas/cloth.schema';

/**
 * Service that provides order management
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);
  constructor(
    @Inject(ORDER_MODEL_SCHEMA)
    private readonly orderSchema: Model<IOrderSchema>,
    @Inject(CLOTH_MODEL_SCHEMA)
    private readonly clothSchema: Model<IClothSchema>,
  ) {}

  async createOrder(
    dto: OrderCreateRequestDto,
    userEmail: string,
  ): Promise<IOrderSchema> {
    try {
      const lastOrder = await this.orderSchema
        .find(null, null, { sort: { id: -1 } })
        .limit(1);

      const price = await this.getPriceByClothIds(dto.clothIdList);

      return this.orderSchema.create({
        ...dto,
        id: (lastOrder[0]?.id || 0) + 1,
        price,
        createdAt: new Date().toISOString(),
        createdBy: userEmail,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getOrder(dto: GetOrderRequest): Promise<GetOrderResponse> {
    try {
      const { limit, page, order, orderBy, ...filter } = dto;
      const skip = limit * page;

      const orders = await this.orderSchema
        .find(
          {
            deletedBy: null,
            ...filter,
          },
          null,
          { sort: { [orderBy || 'id']: order === EnumSort.desc ? -1 : 1 } },
        )
        .limit(limit)
        .skip(skip);

      const orderCount = await this.orderSchema.count({
        deletedBy: null,
        ...filter,
      });

      return {
        order: orders,
        orderCount,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async updateOrder(
    dto: OrderUpdateRequestDto,
    userEmail: string,
  ): Promise<IOrderSchema> {
    try {
      const { id, ...updateData } = dto;
      const existingOrder = await this.orderSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
      if (!existingOrder) {
        throw new NotFoundException(`Не знайдено магазин з ID ${id}}`);
      }

      let price;
      if (dto.clothIdList){
        price = await this.getPriceByClothIds(dto.clothIdList);
      }

      const updateResult = await existingOrder.updateOne({
        ...updateData,
        price,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail,
      });

      if (updateResult.modifiedCount === 0) {
        throw new BadGatewayException('Помилка під час оновлення');
      }

      return this.orderSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async softDeleteOrder(id: number, userEmail: string): Promise<number> {
    try {
      const existingOrder = await this.orderSchema.findOne({
        id,
        deletedBy: null,
      });
      if (!existingOrder) {
        throw new NotFoundException(`Не знайдено магазин з ID ${id}}`);
      }

      const updateResult = await existingOrder.updateOne({
        updatedAt: new Date().toISOString(),
        deletedBy: userEmail,
      });

      if (updateResult.modifiedCount === 0) {
        throw new BadGatewayException('Помилка під час оновлення');
      }

      return id;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async getPriceByClothIds(clothIdList: ClothId[]) {
    const clothIds = clothIdList.map((clothId) => clothId.clothId);

    const clothes = await this.clothSchema.find({
      id: { $in: clothIds },
    });

    const clothPriceByClothId = clothes.reduce((prev, cur) => {
      prev[cur.id] = cur.price;
      return prev;
    }, {} as Record<string, any>);

    const clothAmountByClothId = clothIdList.reduce((prev, cur) => {
      prev[cur.clothId] = cur.amount;
      return prev;
    }, {} as Record<string, any>);
    return clothIds.reduce((prev, cur) => {
      if (!clothPriceByClothId[cur]) {
        throw new NotFoundException(`Не знайдено товару з ID ${cur}`);
      }
      return prev + clothPriceByClothId[cur] * clothAmountByClothId[cur];
    }, 0);
  }
}
