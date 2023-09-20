import { EnumSort } from 'src/shared/enums/enum.sort';

export class GetStaffRequest {
  limit: number;
  page: number;
  order: EnumSort;
  orderBy: string;
  email: string;
  id: number;
  isAdmin: boolean;
  name: string;
  position: string;
  storeId: number;
}
