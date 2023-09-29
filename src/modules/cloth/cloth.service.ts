import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ClothCreateRequestDto } from '../cloth/dto/cloth-create.request.dto';
import { GetClothRequest } from '../cloth/dto/cloth-get.request.dto';
import { GetClothResponse } from '../cloth/dto/cloth-get.response.dto';
import { ClothUpdateRequestDto } from '../cloth/dto/cloth-update.request.dto';
import {
  IClothSizesInShop,
  IClothSizesInShops,
} from '../cloth/dto/cloth-get-details.response.dto';
import {
  CLOTH_MODEL_SCHEMA,
  IClothSchema,
} from '../mongodb/schemas/cloth.schema';
import { EnumSort } from '../../shared/enums/sort.enum';
import {
  IWarehouseSchema,
  WAREHOUSE_MODEL_SCHEMA,
} from '../mongodb/schemas/warehouse.schema';

/**
 * Service that provides cloth management
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class ClothService {
  private logger = new Logger(ClothService.name);
  constructor(
    @Inject(CLOTH_MODEL_SCHEMA)
    private readonly clothSchema: Model<IClothSchema>,
    @Inject(WAREHOUSE_MODEL_SCHEMA)
    private readonly warehouseSchema: Model<IWarehouseSchema>,
  ) {}

  async createCloth(
    dto: ClothCreateRequestDto,
    userEmail: string,
  ): Promise<IClothSchema> {
    try {
      const existingName = await this.clothSchema.findOne({
        name: dto.name,
      });

      if (existingName) {
        throw new BadRequestException('Одяг з такою назвою вже існує');
      }

      const lastCloth = await this.clothSchema
        .find(null, null, { sort: { id: -1 } })
        .limit(1);

      return this.clothSchema.create({
        ...dto,
        id: (lastCloth[0]?.id || 0) + 1,
        createdAt: new Date().toISOString(),
        createdBy: userEmail,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getCloth(dto: GetClothRequest): Promise<GetClothResponse> {
    try {
      const {
        limit,
        page,
        order,
        orderBy,
        desc,
        priceFrom,
        priceTo,
        ...filter
      } = dto;
      const skip = limit * page;

      const aggregateFilter = {} as Record<string, any>;

      if (desc) {
        aggregateFilter.email = { $regex: desc, $options: 'i' };
      }

      if (priceFrom || priceTo) {
        if (priceFrom && priceTo) {
          aggregateFilter.price = { $gte: priceFrom, $lte: priceTo };
        } else if (priceFrom) {
          aggregateFilter.price = { $gte: priceFrom };
        } else {
          aggregateFilter.price = { $lte: priceTo };
        }
      }

      const cloth = await this.clothSchema
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

      const clothCount = await this.clothSchema.count({
        deletedBy: null,
        ...filter,
        ...aggregateFilter,
      });

      return {
        cloth,
        clothCount,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getClothDetails(id: number): Promise<IClothSizesInShops> {
    const cloth = await this.clothSchema.findOne({ id });

    if (!cloth) {
      throw new NotFoundException(`Одяг з ID ${id} не знайдено`);
    }

    const warehouse = await this.warehouseSchema.find({
      clothId: id,
      deletedBy: null,
      amount: { $gt: 0 },
    });

    const shops = warehouse.reduce((prev, cur) => {
      if (!prev.find((val) => val.shopId === cur.storeId)) {
        prev.push({
          shopId: cur.storeId,
          sizes: [{ size: cur.size, count: cur.amount }],
        });
      } else {
        prev = prev.map((val) => {
          if (val.shopId === cur.storeId) {
            return {
              shopId: val.shopId,
              sizes: [...val.sizes, { size: cur.size, count: cur.amount }],
            };
          }
          return val;
        });
      }
      return prev;
    }, [] as IClothSizesInShop[]);

    return { clothId: id, shops };
  }

  async updateCloth(
    dto: ClothUpdateRequestDto,
    userEmail: string,
  ): Promise<IClothSchema> {
    try {
      const { id, ...updateData } = dto;
      const existingCloth = await this.clothSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
      if (!existingCloth) {
        throw new NotFoundException(`Не знайдено одяг з ID ${id}}`);
      }

      const updateResult = await existingCloth.updateOne({
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail,
      });

      if (updateResult.modifiedCount === 0) {
        throw new BadGatewayException('Помилка під час оновлення');
      }

      return this.clothSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async softDeleteCloth(id: number, userEmail: string): Promise<number> {
    try {
      const existingCloth = await this.clothSchema.findOne({
        id,
        deletedBy: null,
      });
      if (!existingCloth) {
        throw new NotFoundException(`Не знайдено одяг з ID ${id}}`);
      }

      const updateResult = await existingCloth.updateOne({
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

  async getClothesAvailableSizes(id: number): Promise<string[]> {
    const cloth = await this.clothSchema.findOne({ id, deletedBy: null });
    if (!cloth) {
      throw new NotFoundException(`Не знайдено одяг з ID ${id}`);
    }
    return cloth.availableSizes;
  }
}
