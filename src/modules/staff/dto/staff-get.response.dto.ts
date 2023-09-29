import { IStaffSchema } from '../../mongodb/schemas/staff.schema';

export class GetStaffResponse {
  staff: IStaffSchema[];
  staffCount: number;
}
