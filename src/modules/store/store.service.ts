import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { StoreCreateRequestDto } from '../store/dto/store-create.request.dto';
import { GetStoreRequest } from '../store/dto/store-get.request.dto';
import { GetStoreResponse } from '../store/dto/store-get.response.dto';
import { StoreUpdateRequestDto } from '../store/dto/store-update.request.dto';
import {
  STORE_MODEL_SCHEMA,
  IStoreSchema,
} from '../mongodb/schemas/store.schema';
import { EnumSort } from '../../shared/enums/sort.enum';

/**
 * Service that provides store management
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class StoreService {
  private logger = new Logger(StoreService.name);
  constructor(
    @Inject(STORE_MODEL_SCHEMA)
    private readonly storeSchema: Model<IStoreSchema>,
  ) {}

  async createStore(
    dto: StoreCreateRequestDto,
    userEmail: string,
  ): Promise<IStoreSchema> {
    try {
      const existingStore = await this.storeSchema.findOne({
        email: dto.address,
      });

      if (existingStore) {
        throw new BadRequestException('Магазин з такою адресою вже існує');
      }

      const lastStore = await this.storeSchema
        .find(null, null, { sort: { id: -1 } })
        .limit(1);

      return this.storeSchema.create({
        ...dto,
        id: (lastStore[0]?.id || 0) + 1,
        createdAt: new Date().toISOString(),
        createdBy: userEmail,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getStore(dto: GetStoreRequest): Promise<GetStoreResponse> {
    try {
      const { limit, page, order, orderBy, address, ...filter } = dto;
      const skip = limit * page;

      const aggregateFilter = {} as Record<string, any>;

      if (address) {
        aggregateFilter.address = { $regex: address, $options: 'i' };
      }

      const store = await this.storeSchema
        .find(
          {
            deletedBy: null,
            ...filter,
            ...aggregateFilter,
          },
          null,
          { sort: { [orderBy || 'id']: order === EnumSort.desc ? -1 : 1 } },
        )
        .limit(limit)
        .skip(skip);

      const storeCount = await this.storeSchema.count({
        deletedBy: null,
        ...filter,
        ...aggregateFilter,
      });

      return {
        store,
        storeCount,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getStoreById(id: number): Promise<IStoreSchema> {
    return this.storeSchema.findOne({ id, deletedBy: null });
  }

  async updateStore(
    dto: StoreUpdateRequestDto,
    userEmail: string,
  ): Promise<IStoreSchema> {
    try {
      const { id, ...updateData } = dto;
      const existingStore = await this.storeSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
      if (!existingStore) {
        throw new NotFoundException(`Не знайдено магазин з ID ${id}`);
      }

      const updateResult = await existingStore.updateOne({
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail,
      });

      if (updateResult.modifiedCount === 0) {
        throw new BadGatewayException('Помилка під час оновлення');
      }

      return this.storeSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async softDeleteStore(id: number, userEmail: string): Promise<number> {
    try {
      const existingStore = await this.storeSchema.findOne({
        id,
        deletedBy: null,
      });
      if (!existingStore) {
        throw new NotFoundException(`Не знайдено магазин з ID ${id}`);
      }

      const updateResult = await existingStore.updateOne({
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
