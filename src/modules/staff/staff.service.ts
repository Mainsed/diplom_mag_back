import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  STAFF_MODEL_SCHEMA,
  IStaffSchema,
} from 'src/modules/mongodb/schemas/staff.schema';
import { StaffCreateRequestDto } from 'src/modules/staff/dto/staff-create.request.dto';
import { GetStaffRequest } from 'src/modules/staff/dto/staff-get.request.dto';
import { GetStaffResponse } from 'src/modules/staff/dto/staff-get.response.dto';

/**
 * Service that provides auth logic
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class StaffService {
  private logger = new Logger(StaffService.name);
  constructor(
    @Inject(STAFF_MODEL_SCHEMA)
    private readonly staffSchema: Model<IStaffSchema>,
  ) {}

  async createStaff(
    dto: StaffCreateRequestDto,
    userEmail: string,
  ): Promise<IStaffSchema> {
    try {
      const existingEmail = await this.staffSchema.findOne({
        email: dto.email,
      });

      if (existingEmail) {
        throw new BadRequestException('Користувач з такою поштою вже існує');
      }

      const lastStaff = await this.staffSchema
        .find(null, null, { sort: { id: -1 } })
        .limit(1);

      return this.staffSchema.create({
        ...dto,
        id: lastStaff[0].id + 1,
        createdAt: new Date().toISOString(),
        createdBy: userEmail,
        isHidden: false,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getStaff(dto: GetStaffRequest): Promise<GetStaffResponse> {
    try {
      const skip = dto.limit * dto.page;
      const staff = await this.staffSchema
        .find({
          deletedBy: null,
          isHidden: false,
        })
        .limit(dto.limit)
        .skip(skip);

      const staffCount = await this.staffSchema.count({
        deletedBy: null,
        isHidden: false,
      });

      return {
        staff,
        staffCount,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
