import { IStaffSchema } from '@modules/mongodb/schemas/staff.schema';

export class GetStaffResponse {
  staff: IStaffSchema[];
  staffCount: number;
}
