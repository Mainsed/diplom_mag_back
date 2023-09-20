import { Controller, Body, Post, Get, Query } from '@nestjs/common';
import { StaffService } from 'src/modules/staff/staff.service';
import { StaffCreateRequestDto } from 'src/modules/staff/dto/staff-create.request.dto';
import { UserEmail } from 'src/shared/decorators/user-email.decorator';
import { GetStaffRequest } from 'src/modules/staff/dto/staff-get.request.dto';

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
}
