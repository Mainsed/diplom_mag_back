import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ClothService } from '../cloth/cloth.service';
import { ClothCreateRequestDto } from '../cloth/dto/cloth-create.request.dto';
import { UserEmail } from '../../shared/decorators/user-email.decorator';
import { GetClothRequest } from '../cloth/dto/cloth-get.request.dto';
import { IClothSchema } from '../mongodb/schemas/cloth.schema';
import { ClothUpdateRequestDto } from '../cloth/dto/cloth-update.request.dto';

/**
 * Controler to execute clothorization
 * @param {ClothService} clothService - cloth service instance
 */
@Controller('cloth')
export class ClothController {
  constructor(private readonly clothService: ClothService) {}

  @Post()
  async createCloth(
    @Body() dto: ClothCreateRequestDto,
    @UserEmail() userEmail: string,
  ) {
    return this.clothService.createCloth(dto, userEmail);
  }

  @Get()
  async getCloth(@Query() dto: GetClothRequest) {
    return this.clothService.getCloth(dto);
  }

  @Get('/:id')
  async getClothDetails(@Param('id') id: string) {
    return this.clothService.getClothDetails(parseInt(id));
  }

  @Put()
  async updateCloth(
    @Body() dto: ClothUpdateRequestDto,
    @UserEmail() userEmail: string,
  ): Promise<IClothSchema> {
    return this.clothService.updateCloth(dto, userEmail);
  }

  @Delete()
  async deleteCloth(
    @Query('id') id: number,
    @UserEmail() userEmail: string,
  ): Promise<number> {
    return this.clothService.softDeleteCloth(id, userEmail);
  }
}
