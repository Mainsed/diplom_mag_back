import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
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
  IncomeByMonth,
  SizesPopularityByMonth,
  StaffChanges,
  StaffChangesByMonth,
  StoreBySales,
} from 'src/modules/reports/dto/reports-get.response.dto';
import { ClothSizes } from 'src/shared/enums/cloth-sizes.enum';
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
        previousHalfYearOrders,
      );
      const staffChanges = await this.getStaffChanges(currentHalfYearDate);
      const storesBySales = await this.getStoreBySales(
        currentHalfYearOrders,
        previousHalfYearOrders,
      );

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

    const clothSales = Object.keys(currentHalfYearSales)
      .map((clothId) => ({
        clothId: parseInt(clothId),
        numberOfSales: currentHalfYearSales[clothId],
        change: previousHalfYearSales[clothId]
          ? currentHalfYearSales[clothId] - previousHalfYearSales[clothId]
          : 0,
      }))
      .sort((a, b) => b.numberOfSales - a.numberOfSales);
    return clothSales.length > 5 ? clothSales.slice(0, 5) : clothSales;
  }

  private async getHalfYearIncome(
    halfYearOrders: IOrderSchema[],
  ): Promise<HalfYearIncome> {
    const currentMonth = new Date().getMonth() + 1;
    const months = Array(6)
      .fill(0)
      .map((val, i) => currentMonth - i)
      .reverse();

    const incomeByMonth = months.map((monthNumber) => ({
      monthNumber,
      income: 0,
    })) as IncomeByMonth[];

    let totalIncome = 0;
    halfYearOrders.forEach((cur) => {
      const month = new Date(cur.createdAt).getMonth() + 1;

      const incomeByMonthEntry = incomeByMonth.find(
        (val) => val.monthNumber === month,
      );
      incomeByMonthEntry.income += cur.price;

      totalIncome += cur.price;
    });

    return {
      incomeByMonth,
      totalIncome,
    };
  }

  private async getSizesPopularityByMonth(
    currentHalfYearOrders: IOrderSchema[],
    previousHalfYearOrders: IOrderSchema[],
  ): Promise<SizesPopularityByMonth[]> {
    const currentHalfYearSales = currentHalfYearOrders.reduce((prev, cur) => {
      cur.clothIdList.forEach((clothId) => {
        if (prev[clothId.size]) {
          prev[clothId.size] += clothId.amount;
        } else {
          prev[clothId.size] = clothId.amount;
        }
      });
      return prev;
    }, {} as Record<ClothSizes, any>);

    const previousHalfYearSales = previousHalfYearOrders.reduce((prev, cur) => {
      cur.clothIdList.forEach((clothId) => {
        if (prev[clothId.size]) {
          prev[clothId.size] += clothId.amount;
        } else {
          prev[clothId.size] = clothId.amount;
        }
      });
      return prev;
    }, {} as Record<ClothSizes, any>);

    const sizePopularity = Object.keys(currentHalfYearSales)
      .map((size: ClothSizes) => ({
        size: size,
        numberOfSales: currentHalfYearSales[size],
        change: previousHalfYearSales[size]
          ? currentHalfYearSales[size] - previousHalfYearSales[size]
          : 0,
      }))
      .sort((a, b) => b.numberOfSales - a.numberOfSales);
    return sizePopularity.length > 5
      ? sizePopularity.slice(0, 5)
      : sizePopularity;
  }

  private async getStaffChanges(
    currentHalfYearDate: string,
  ): Promise<StaffChanges> {
    const firedStaffHalfYear = await this.staffSchema.find({
      updatedAt: {
        $gt: currentHalfYearDate,
      },
      isHidden: false,
      deletedBy: { $ne: null },
    });
    const hiredStaffHalfYear = await this.staffSchema.find({
      createdAt: {
        $gt: currentHalfYearDate,
      },
      isHidden: false,
      deletedBy: null,
    });

    const totalStaffNumber = await this.staffSchema.count({
      deletedBy: null,
      isHidden: false,
    });

    const currentMonth = new Date().getMonth() + 1;
    const months = Array(6)
      .fill(0)
      .map((val, i) => currentMonth - i)
      .reverse();

    const staffChangesByMonth = months.map((monthNumber) => ({
      monthNumber,
      firedStaffCount: 0,
      hiredStaffCount: 0,
    })) as StaffChangesByMonth[];

    firedStaffHalfYear.forEach((cur) => {
      const month = new Date(cur.updatedAt).getMonth() + 1;

      const staffChanges = staffChangesByMonth.find(
        (val) => val.monthNumber === month,
      );

      if (!staffChanges) return;

      staffChanges.firedStaffCount += 1;
    });

    hiredStaffHalfYear.forEach((cur) => {
      const month = new Date(cur.createdAt).getMonth() + 1;

      const staffChanges = staffChangesByMonth.find(
        (val) => val.monthNumber === month,
      );

      if (!staffChanges) return;

      staffChanges.hiredStaffCount += 1;
    });

    return {
      staffChangesByMonth,
      totalStaffNumber,
    };
  }

  private async getStoreBySales(
    currentHalfYearOrders: IOrderSchema[],
    previousHalfYearOrders: IOrderSchema[],
  ): Promise<StoreBySales[]> {
    const currentHalfYearSales = currentHalfYearOrders.reduce((prev, cur) => {
      cur.clothIdList.forEach((clothId) => {
        if (prev[clothId.storeId]) {
          prev[clothId.storeId] += clothId.amount;
        } else {
          prev[clothId.storeId] = clothId.amount;
        }
      });
      return prev;
    }, {} as Record<number, any>);

    const previousHalfYearSales = previousHalfYearOrders.reduce((prev, cur) => {
      cur.clothIdList.forEach((clothId) => {
        if (prev[clothId.storeId]) {
          prev[clothId.storeId] += clothId.amount;
        } else {
          prev[clothId.storeId] = clothId.amount;
        }
      });
      return prev;
    }, {} as Record<number, any>);

    const storesBySales = Object.keys(currentHalfYearSales)
      .map((storeId) => ({
        storeId: parseInt(storeId),
        numberOfSales: currentHalfYearSales[storeId],
        change: previousHalfYearSales[storeId]
          ? currentHalfYearSales[storeId] - previousHalfYearSales[storeId]
          : 0,
      }))
      .sort((a, b) => b.numberOfSales - a.numberOfSales);
    return storesBySales.length > 5 ? storesBySales.slice(0, 5) : storesBySales;
  }

  private getPrevHalfYearDate(currentDate = new Date().toISOString()) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 5, 1);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }
}
