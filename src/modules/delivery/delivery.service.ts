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
  DELIVERY_MODEL_SCHEMA,
  IDeliverySchema,
} from '../mongodb/schemas/delivery.schema';
import { DeliveryCreateRequestDto } from '../delivery/dto/delivery-create.request.dto';
import { GetDeliveryRequest } from '../delivery/dto/delivery-get.request.dto';
import { GetDeliveryResponse } from '../delivery/dto/delivery-get.response.dto';
import { DeliveryUpdateRequestDto } from '../delivery/dto/delivery-update.request.dto';
import { EnumSort } from '../../shared/enums/sort.enum';
import {
  IWarehouseSchema,
  WAREHOUSE_MODEL_SCHEMA,
} from '../mongodb/schemas/warehouse.schema';
import { StoreService } from '../store/store.service';
import { ClothService } from '../cloth/cloth.service';

/**
 * Service that provides delivery management
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class DeliveryService {
  private logger = new Logger(DeliveryService.name);
  constructor(
    @Inject(DELIVERY_MODEL_SCHEMA)
    private readonly deliverySchema: Model<IDeliverySchema>,
    @Inject(WAREHOUSE_MODEL_SCHEMA)
    private readonly warehouseSchema: Model<IWarehouseSchema>,
    private readonly storeService: StoreService,
    private readonly clothService: ClothService,
  ) {}

  async createDelivery(
    dto: DeliveryCreateRequestDto,
    userEmail: string,
  ): Promise<IDeliverySchema> {
    try {
      const lastDelivery = await this.deliverySchema
        .find(null, null, { sort: { id: -1 } })
        .limit(1);

      const receiverStore = await this.storeService.getStoreById(
        dto.deliveredTo,
      );

      if (!receiverStore) {
        throw new NotFoundException(
          `Не знайдено магазин з ID ${dto.deliveredTo}`,
        );
      }

      await Promise.all(
        dto.clothDelivered.map(async (clothDelivered) => {
          const clothAvailableSizes =
            await this.clothService.getClothesAvailableSizes(
              clothDelivered.clothId,
            );
          clothDelivered.sizes.map((size) => {
            if (!clothAvailableSizes.includes(size.size)) {
              throw new BadRequestException(
                `Одяг з ID ${clothDelivered.clothId} не може мати розмір ${size.size}`,
              );
            }
          });
        }),
      );

      let totalAmountDelivered = 0;

      const warehouseCreateArrays = await Promise.all(
        dto.clothDelivered.map(async (cloth) => {
          const warehouseClothes = await this.warehouseSchema.find({
            clothId: cloth.clothId,
            storeId: dto.deliveredTo,
          });
          return Promise.all(
            cloth.sizes.map(async (size) => {
              const warehouseCloth = warehouseClothes.find(
                (warehouse) => warehouse.size === size.size,
              );

              totalAmountDelivered += size.count;

              if (warehouseCloth) {
                await warehouseCloth.updateOne({
                  id: warehouseCloth.id,
                  amount: warehouseCloth.amount + size.count,
                  updatedAt: new Date().toISOString(),
                  updatedBy: userEmail,
                });
              } else {
                return {
                  clothId: cloth.clothId,
                  storeId: dto.deliveredTo,
                  size: size.size,
                  amount: size.count,
                  createdAt: new Date().toISOString(),
                  createdBy: userEmail,
                };
              }
            }),
          );
        }),
      );

      const warehouseCreateArray = [].concat(...warehouseCreateArrays);

      const lastWarehouse = await this.warehouseSchema
        .find(null, null, { sort: { id: -1 } })
        .limit(1);

      warehouseCreateArray.forEach((warehouseCreate, i) => {
        if (!warehouseCreate) {
          return;
        }
        this.warehouseSchema.create({
          ...warehouseCreate,
          id: (lastWarehouse[0]?.id || 0) + 1 + i,
        });
      });

      return this.deliverySchema.create({
        ...dto,
        totalAmountDelivered,
        id: (lastDelivery[0]?.id || 0) + 1,
        createdAt: new Date().toISOString(),
        createdBy: userEmail,
        isHidden: false,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getDelivery(dto: GetDeliveryRequest): Promise<GetDeliveryResponse> {
    try {
      const { limit, page, order, orderBy, ...filter } = dto;
      const skip = limit * page;

      const delivery = await this.deliverySchema
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

      const deliveryCount = await this.deliverySchema.count({
        deletedBy: null,
        ...filter,
      });

      return {
        delivery,
        deliveryCount,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async updateDelivery(
    dto: DeliveryUpdateRequestDto,
    userEmail: string,
  ): Promise<IDeliverySchema> {
    try {
      const { id, ...updateData } = dto;
      const existingDelivery = await this.deliverySchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
      if (!existingDelivery) {
        throw new NotFoundException(`Не знайдено поставку з ID ${id}`);
      }

      const updateResult = await existingDelivery.updateOne({
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail,
      });

      if (updateResult.modifiedCount === 0) {
        throw new BadGatewayException('Помилка під час оновлення');
      }

      return this.deliverySchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async softDeleteDelivery(id: number, userEmail: string): Promise<number> {
    try {
      const existingDelivery = await this.deliverySchema.findOne({
        id,
        deletedBy: null,
      });
      if (!existingDelivery) {
        throw new NotFoundException(`Не знайдено поставку з ID ${id}`);
      }

      await Promise.all(
        existingDelivery.clothDelivered.map(async (cloth) => {
          const warehouseClothes = await this.warehouseSchema.find({
            clothId: cloth.clothId,
            storeId: existingDelivery.deliveredTo,
          });

          if (!warehouseClothes) {
            throw new BadGatewayException(
              'Не вдається знайти один або декілька товарів з доставки.',
            );
          }

          return Promise.all(
            cloth.sizes.map(async (size) => {
              const warehouseCloth = warehouseClothes.find(
                (warehouse) => warehouse.size === size.size,
              );

              const amount = warehouseCloth.amount - size.count;
              if (amount < 0) {
                throw new BadRequestException(
                  `Не можливо видалити поставку. Один або декілька товарів будуть мати від'ємну кількість.`,
                );
              }

              await warehouseCloth.updateOne({
                id: warehouseCloth.id,
                amount,
                updatedAt: new Date().toISOString(),
                updatedBy: userEmail,
              });
            }),
          );
        }),
      );

      const updateResult = await existingDelivery.updateOne({
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
}
