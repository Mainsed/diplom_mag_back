import { ClothSizes } from '@shared/enums/cloth-sizes.enum';

export class StoreBySales {
  storeId: number;
  numberOfSales: number;
  change: number;
}

export class ClothBySales {
  clothId: number;
  numberOfSales: number;
  change: number;
}

export class IncomeByMonth {
  income: number;
  monthNumber: number;
}

export class HalfYearIncome {
  totalIncome: number;
  incomeByMonth: IncomeByMonth[];
}

export class StaffChangesByMonth {
  firedStaffCount: number;
  hiredStaffCount: number;
  monthNumber: number;
}

export class StaffChanges {
  staffChangesByMonth: StaffChangesByMonth[];
  totalStaffNumber: number;
}

export class SizesPopularityByMonth {
  size: ClothSizes;
  numberOfSales: number;
  change: number;
}

export class GetReportResponse {
  storesBySales: StoreBySales[];
  clothesBySales: ClothBySales[];
  halfYearIncome: HalfYearIncome;
  staffChanges: StaffChanges;
  sizePopularity: SizesPopularityByMonth[];
}
