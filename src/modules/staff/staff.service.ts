import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  STAFF_MODEL_SCHEMA,
  IStaffSchema,
} from '../mongodb/schemas/staff.schema';
import { StaffCreateRequestDto } from '../staff/dto/staff-create.request.dto';
import { GetStaffRequest } from '../staff/dto/staff-get.request.dto';
import { GetStaffResponse } from '../staff/dto/staff-get.response.dto';
import { StaffUpdateRequestDto } from '../staff/dto/staff-update.request.dto';
import { EnumSort } from '../../shared/enums/sort.enum';

/**
 * Service that provides staff management
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
        id: (lastStaff[0]?.id || 0) + 1,
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
      const { limit, page, order, orderBy, email, name, position, ...filter } =
        dto;
      const skip = limit * page;

      const aggregateFilter = {} as Record<string, any>;

      if (email) {
        aggregateFilter.email = { $regex: email, $options: 'i' };
      }

      if (name) {
        aggregateFilter.name = { $regex: name, $options: 'i' };
      }

      if (position) {
        aggregateFilter.position = { $regex: position, $options: 'i' };
      }

      const staff = await this.staffSchema
        .find(
          {
            deletedBy: null,
            isHidden: false,
            ...filter,
            ...aggregateFilter,
          },
          null,
          { sort: { [orderBy || 'id']: order === EnumSort.desc ? -1 : 1 } },
        )
        .limit(limit)
        .skip(skip);

      const staffCount = await this.staffSchema.count({
        deletedBy: null,
        isHidden: false,
        ...filter,
        ...aggregateFilter,
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

  async updateStaff(
    dto: StaffUpdateRequestDto,
    userEmail: string,
  ): Promise<IStaffSchema> {
    try {
      const { id, ...updateData } = dto;
      const existingStaff = await this.staffSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
      if (!existingStaff) {
        throw new NotFoundException(`Не знайдено користувача з ID ${id}`);
      }

      const updateResult = await existingStaff.updateOne({
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail,
      });

      if (updateResult.modifiedCount === 0) {
        throw new BadGatewayException('Помилка під час оновлення');
      }

      return this.staffSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async softDeleteStaff(id: number, userEmail: string): Promise<number> {
    try {
      const existingStaff = await this.staffSchema.findOne({
        id,
        deletedBy: null,
      });
      if (!existingStaff) {
        throw new NotFoundException(`Не знайдено користувача з ID ${id}`);
      }

      const updateResult = await existingStaff.updateOne({
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
