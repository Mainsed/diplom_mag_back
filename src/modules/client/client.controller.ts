import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { ClientService } from 'src/modules/client/client.service';
import { ClientCreateRequestDto } from 'src/modules/client/dto/client-create.request.dto';
import { UserEmail } from 'src/shared/decorators/user-email.decorator';
import { GetClientRequest } from 'src/modules/client/dto/client-get.request.dto';
import { IClientSchema } from 'src/modules/mongodb/schemas/client.schema';
import { ClientUpdateRequestDto } from 'src/modules/client/dto/client-update.request.dto';

/**
 * Controler to execute clientorization
 * @param {ClientService} clientService - client service instance
 */
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(
    @Body() dto: ClientCreateRequestDto,
    @UserEmail() userEmail: string,
  ) {
    return this.clientService.createClient(dto, userEmail);
  }

  @Get()
  async getClient(@Query() dto: GetClientRequest) {
    return this.clientService.getClient(dto);
  }

  @Put()
  async updateClient(
    @Body() dto: ClientUpdateRequestDto,
    @UserEmail() userEmail: string,
  ): Promise<IClientSchema> {
    return this.clientService.updateClient(dto, userEmail);
  }

  @Delete()
  async deleteClient(
    @Query('id') id: number,
    @UserEmail() userEmail: string,
  ): Promise<number> {
    return this.clientService.softDeleteClient(id, userEmail);
  }
}
