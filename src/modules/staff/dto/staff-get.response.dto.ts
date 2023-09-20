import { IStaffSchema } from 'src/modules/mongodb/schemas/staff.schema';

export class GetStaffResponse {
  staff: IStaffSchema[];
  staffCount: number;
}
