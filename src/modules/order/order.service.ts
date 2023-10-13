import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  ClothId,
  OrderCreateRequestDto,
} from '../order/dto/order-create.request.dto';
import { GetOrderRequest } from '../order/dto/order-get.request.dto';
import { GetOrderResponse } from '../order/dto/order-get.response.dto';
import { OrderUpdateRequestDto } from '../order/dto/order-update.request.dto';
import {
  ORDER_MODEL_SCHEMA,
  IOrderSchema,
  IClothId,
} from '../mongodb/schemas/order.schema';
import { EnumSort } from '../../shared/enums/sort.enum';
import {
  CLOTH_MODEL_SCHEMA,
  IClothSchema,
} from '../mongodb/schemas/cloth.schema';
import {
  IWarehouseSchema,
  WAREHOUSE_MODEL_SCHEMA,
} from '../mongodb/schemas/warehouse.schema';
import { OrderStatuses } from '../../shared/enums/order-statuses.enum';

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
    @Inject(WAREHOUSE_MODEL_SCHEMA)
    private readonly warehouseSchema: Model<IWarehouseSchema>,
  ) {}

  async createOrder(
    dto: OrderCreateRequestDto,
    userEmail: string,
  ): Promise<IOrderSchema> {
    try {
      if (dto.status === OrderStatuses.RETURNED) {
        throw new BadRequestException(
          'Не можливо створини замовлення з статусом RETURNED',
        );
      }

      let clothIdList: IClothId[];

      if (
        [
          OrderStatuses.COMPLETED,
          OrderStatuses.DELIVERED,
          OrderStatuses.SENT,
        ].includes(dto.status)
      ) {
        const warehouseObjects = await Promise.all(
          dto.clothIdList.map(async (clothId) => {
            const warehouse = await this.warehouseSchema.findOne({
              clothId: clothId.clothId,
              amount: { $gte: clothId.amount },
              size: clothId.size,
              deletedBy: null,
            });

            if (!warehouse) {
              throw new BadRequestException(
                `Товару з ID ${clothId.clothId} не має в достатній кількості на складах.`,
              );
            }

            return { clothId, warehouse };
          }),
        );

        clothIdList = await Promise.all(
          warehouseObjects.map(async (obj) => {
            await obj.warehouse.updateOne({
              id: obj.warehouse.id,
              amount: obj.warehouse.amount - obj.clothId.amount,
              updatedAt: new Date().toISOString(),
              updatedBy: userEmail,
            });

            return {
              ...obj.clothId,
              storeId: obj.warehouse.storeId,
            };
          }),
        );
      }

      const lastOrder = await this.orderSchema
        .find(null, null, { sort: { id: -1 } })
        .limit(1);

      const price = await this.getPriceByClothIds(dto.clothIdList);

      return this.orderSchema.create({
        ...dto,
        clothIdList: clothIdList || dto.clothIdList,
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
        throw new NotFoundException(`Не знайдено магазин з ID ${id}`);
      }

      let clothIdList: IClothId[];

      const OrderStatusesToTakeClothFromWarehouse = [
        OrderStatuses.COMPLETED,
        OrderStatuses.DELIVERED,
        OrderStatuses.SENT,
      ];

      if (
        OrderStatusesToTakeClothFromWarehouse.includes(existingOrder.status) &&
        (dto.clothIdList ||
          (dto.status &&
            dto.status !== OrderStatuses.RETURNED &&
            !OrderStatusesToTakeClothFromWarehouse.includes(dto.status)))
      ) {
        throw new BadRequestException(
          'Не можливо змінити товари в замовленні або статус замовлення. Замовлення вже було відправлене.',
        );
      }
      if (
        dto.status === OrderStatuses.RETURNED &&
        !OrderStatusesToTakeClothFromWarehouse.includes(existingOrder.status)
      ) {
        throw new BadRequestException(
          'Не можливо змінити статус замовлення на RETURNED. Замовлення не було відправлене.',
        );
      }

      if (
        OrderStatusesToTakeClothFromWarehouse.includes(dto.status) &&
        !OrderStatusesToTakeClothFromWarehouse.includes(existingOrder.status)
      ) {
        const warehouseObjects = await Promise.all(
          (dto.clothIdList || existingOrder.clothIdList).map(
            async (clothId) => {
              const warehouse = await this.warehouseSchema.findOne({
                clothId: clothId.clothId,
                amount: { $gte: clothId.amount },
                size: clothId.size,
                deletedBy: null,
              });

              if (!warehouse) {
                throw new BadRequestException(
                  `Товару з ID ${clothId.clothId} та розміром ${clothId.size} не має в достатній кількості на складах.`,
                );
              }

              return { clothId, warehouse };
            },
          ),
        );

        clothIdList = await Promise.all(
          warehouseObjects.map(async (obj) => {
            await obj.warehouse.updateOne({
              id: obj.warehouse.id,
              amount: obj.warehouse.amount - obj.clothId.amount,
              updatedAt: new Date().toISOString(),
              updatedBy: userEmail,
            });

            return {
              ...obj.clothId,
              storeId: obj.warehouse.storeId,
            };
          }),
        );
      }

      if (dto.status === OrderStatuses.RETURNED) {
        const warehouseObjects = await Promise.all(
          existingOrder.clothIdList.map(async (clothId) => {
            const warehouse = await this.warehouseSchema.findOne({
              clothId: clothId.clothId,
              storeId: clothId.storeId,
              size: clothId.size,
              deletedBy: null,
            });

            if (!warehouse) {
              throw new BadRequestException(
                `Товару з ID ${clothId.clothId} не існує у магазині звідки його доставляли.`,
              );
            }

            return { clothId, warehouse };
          }),
        );

        clothIdList = await Promise.all(
          warehouseObjects.map(async (obj) => {
            await obj.warehouse.updateOne({
              id: obj.warehouse.id,
              amount: obj.warehouse.amount + obj.clothId.amount,
              updatedAt: new Date().toISOString(),
              updatedBy: userEmail,
            });

            return {
              ...obj.clothId,
            };
          }),
        );
      }

      let price;
      if (dto.clothIdList) {
        price = await this.getPriceByClothIds(dto.clothIdList);
      }

      const updateResult = await existingOrder.updateOne({
        ...updateData,
        price,
        clothIdList: clothIdList || dto.clothIdList,
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
        throw new NotFoundException(`Не знайдено магазин з ID ${id}`);
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
