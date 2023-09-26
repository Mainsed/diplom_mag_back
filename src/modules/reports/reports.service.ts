import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  CLOTH_MODEL_SCHEMA,
  IClothSchema,
} from 'src/modules/mongodb/schemas/cloth.schema';
import {
  IOrderSchema,
  ORDER_MODEL_SCHEMA,
} from 'src/modules/mongodb/schemas/order.schema';
import {
  STAFF_MODEL_SCHEMA,
  IStaffSchema,
} from 'src/modules/mongodb/schemas/staff.schema';
import {
  ClothBySales,
  GetReportResponse,
  HalfYearIncome,
  SizesPopularityByMonth,
  StaffChanges,
  StoreBySales,
} from 'src/modules/reports/dto/reports-get.response.dto';
import { OrderStatuses } from 'src/shared/enums/order-statuses.enum';

/**
 * Service that provides report management
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class ReportService {
  private logger = new Logger(ReportService.name);
  constructor(
    @Inject(ORDER_MODEL_SCHEMA)
    private readonly orderSchema: Model<IOrderSchema>,
    @Inject(STAFF_MODEL_SCHEMA)
    private readonly staffSchema: Model<IStaffSchema>,
    @Inject(CLOTH_MODEL_SCHEMA)
    private readonly clothSchema: Model<IClothSchema>,
  ) {}

  async getReport(): Promise<GetReportResponse> {
    try {
      const currentHalfYearDate = this.getPrevHalfYearDate();
      const previousHalfYearDate =
        this.getPrevHalfYearDate(currentHalfYearDate);

      const currentHalfYearOrders = await this.orderSchema.find({
        createdAt: { $gt: currentHalfYearDate },
        deletedBy: null,
        status: OrderStatuses.COMPLETED,
      });
      const previousHalfYearOrders = await this.orderSchema.find({
        createdAt: {
          $gt: previousHalfYearDate,
          $lt: currentHalfYearDate,
        },
        deletedBy: null,
        status: OrderStatuses.COMPLETED,
      });

      const clothesBySales = await this.getClothesSales(
        currentHalfYearOrders,
        previousHalfYearOrders,
      );
      const halfYearIncome = await this.getHalfYearIncome(
        currentHalfYearOrders,
      );
      const sizePopularity = await this.getSizesPopularityByMonth(
        currentHalfYearOrders,
      );
      const staffChanges = await this.getStaffChanges();
      const storesBySales = await this.getStoreBySales(currentHalfYearOrders);

      return {
        clothesBySales,
        halfYearIncome,
        sizePopularity,
        staffChanges,
        storesBySales,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private async getClothesSales(
    currentHalfYearOrders: IOrderSchema[],
    previousHalfYearOrders: IOrderSchema[],
  ): Promise<ClothBySales[]> {
    const currentHalfYearSales = currentHalfYearOrders.reduce((prev, cur) => {
      cur.clothIdList.forEach((clothId) => {
        if (prev[clothId.clothId]) {
          prev[clothId.clothId] += clothId.amount;
        } else {
          prev[clothId.clothId] = clothId.amount;
        }
      });
      return prev;
    }, {} as Record<string, any>);

    const previousHalfYearSales = previousHalfYearOrders.reduce((prev, cur) => {
      cur.clothIdList.forEach((clothId) => {
        if (prev[clothId.clothId]) {
          prev[clothId.clothId] += clothId.amount;
        } else {
          prev[clothId.clothId] = clothId.amount;
        }
      });
      return prev;
    }, {} as Record<string, any>);

    return Object.keys(currentHalfYearSales).map((clothId) => ({
      clothId: parseInt(clothId),
      numberOfSales: currentHalfYearSales[clothId],
      change: previousHalfYearSales[clothId]
        ? currentHalfYearSales[clothId] - previousHalfYearSales[clothId]
        : 0,
    }));
  }

  private async getHalfYearIncome(
    halfYearOrders: IOrderSchema[],
  ): Promise<HalfYearIncome> {
    return;
  }

  private async getSizesPopularityByMonth(
    halfYearOrders: IOrderSchema[],
  ): Promise<SizesPopularityByMonth[]> {
    return;
  }

  private async getStaffChanges(): Promise<StaffChanges> {
    return;
  }

  private async getStoreBySales(
    halfYearOrders: IOrderSchema[],
  ): Promise<StoreBySales[]> {
    return;
  }

  private getPrevHalfYearDate(currentDate = new Date().toISOString()) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 5, 1);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }
}
