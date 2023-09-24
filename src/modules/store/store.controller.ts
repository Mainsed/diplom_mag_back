import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { StoreService } from 'src/modules/store/store.service';
import { StoreCreateRequestDto } from 'src/modules/store/dto/store-create.request.dto';
import { UserEmail } from 'src/shared/decorators/user-email.decorator';
import { GetStoreRequest } from 'src/modules/store/dto/store-get.request.dto';
import { IStoreSchema } from 'src/modules/mongodb/schemas/store.schema';
import { StoreUpdateRequestDto } from 'src/modules/store/dto/store-update.request.dto';

/**
 * Controler to execute storeorization
 * @param {StoreService} storeService - store service instance
 */
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async createStore(
    @Body() dto: StoreCreateRequestDto,
    @UserEmail() userEmail: string,
  ) {
    return this.storeService.createStore(dto, userEmail);
  }

  @Get()
  async getStore(@Query() dto: GetStoreRequest) {
    return this.storeService.getStore(dto);
  }

  @Put()
  async updateStore(
    @Body() dto: StoreUpdateRequestDto,
    @UserEmail() userEmail: string,
  ): Promise<IStoreSchema> {
    return this.storeService.updateStore(dto, userEmail);
  }

  @Delete()
  async deleteStore(
    @Query('id') id: number,
    @UserEmail() userEmail: string,
  ): Promise<number> {
    return this.storeService.softDeleteStore(id, userEmail);
  }
}
