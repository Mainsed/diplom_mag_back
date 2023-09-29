import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { StaffService } from '../staff/staff.service';
import { StaffCreateRequestDto } from '../staff/dto/staff-create.request.dto';
import { UserEmail } from '../../shared/decorators/user-email.decorator';
import { GetStaffRequest } from '../staff/dto/staff-get.request.dto';
import { IStaffSchema } from '../mongodb/schemas/staff.schema';
import { StaffUpdateRequestDto } from '../staff/dto/staff-update.request.dto';

/**
 * Controler to execute stafforization
 * @param {StaffService} staffService - staff service instance
 */
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async createStaff(
    @Body() dto: StaffCreateRequestDto,
    @UserEmail() userEmail: string,
  ) {
    return this.staffService.createStaff(dto, userEmail);
  }

  @Get()
  async getStaff(@Query() dto: GetStaffRequest) {
    return this.staffService.getStaff(dto);
  }

  @Put()
  async updateStaff(
    @Body() dto: StaffUpdateRequestDto,
    @UserEmail() userEmail: string,
  ): Promise<IStaffSchema> {
    return this.staffService.updateStaff(dto, userEmail);
  }

  @Delete()
  async deleteStaff(
    @Query('id') id: number,
    @UserEmail() userEmail: string,
  ): Promise<number> {
    return this.staffService.softDeleteStaff(id, userEmail);
  }
}
