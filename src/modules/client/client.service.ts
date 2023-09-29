import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { ClientCreateRequestDto } from '@modules/client/dto/client-create.request.dto';
import { GetClientRequest } from '@modules/client/dto/client-get.request.dto';
import { GetClientResponse } from '@modules/client/dto/client-get.response.dto';
import { ClientUpdateRequestDto } from '@modules/client/dto/client-update.request.dto';
import {
  CLIENT_MODEL_SCHEMA,
  IClientSchema,
} from '@modules/mongodb/schemas/client.schema';
import { EnumSort } from '@shared/enums/sort.enum';

/**
 * Service that provides client management
 * @param {ConfigService} configService - service to interact with env and settings
 * @param {JwtService} jwtService - service to interact with jwt tokens
 */
@Injectable()
export class ClientService {
  private logger = new Logger(ClientService.name);
  constructor(
    @Inject(CLIENT_MODEL_SCHEMA)
    private readonly clientSchema: Model<IClientSchema>,
  ) {}

  async createClient(
    dto: ClientCreateRequestDto,
    userEmail: string,
  ): Promise<IClientSchema> {
    try {
      const existingEmail = await this.clientSchema.findOne({
        email: dto.email,
      });

      if (existingEmail) {
        throw new BadRequestException('Клієнт з такою поштою вже існує');
      }

      const lastClient = await this.clientSchema
        .find(null, null, { sort: { id: -1 } })
        .limit(1);

      return this.clientSchema.create({
        ...dto,
        id: (lastClient[0]?.id || 0) + 1,
        createdAt: new Date().toISOString(),
        createdBy: userEmail,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getClient(dto: GetClientRequest): Promise<GetClientResponse> {
    try {
      const {
        limit,
        page,
        order,
        orderBy,
        email,
        name,
        phoneNumber,
        ...filter
      } = dto;
      const skip = limit * page;

      const aggregateFilter = {} as Record<string, any>;

      if (email) {
        aggregateFilter.email = { $regex: email, $options: 'i' };
      }

      if (name) {
        aggregateFilter.name = { $regex: name, $options: 'i' };
      }

      if (phoneNumber) {
        aggregateFilter.phoneNumber = { $regex: phoneNumber, $options: 'i' };
      }

      const client = await this.clientSchema
        .find(
          {
            deletedBy: null,
            ...filter,
            ...aggregateFilter,
          },
          null,
          { sort: { [orderBy || 'id']: order === EnumSort.desc ? -1 : 1 } },
        )
        .limit(limit)
        .skip(skip);

      const clientCount = await this.clientSchema.count({
        deletedBy: null,
        ...filter,
        ...aggregateFilter,
      });

      return {
        client,
        clientCount,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async updateClient(
    dto: ClientUpdateRequestDto,
    userEmail: string,
  ): Promise<IClientSchema> {
    try {
      const { id, ...updateData } = dto;
      const existingClient = await this.clientSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
      if (!existingClient) {
        throw new NotFoundException(`Не знайдено клієнта з ID ${id}}`);
      }

      const updateResult = await existingClient.updateOne({
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: userEmail,
      });

      if (updateResult.modifiedCount === 0) {
        throw new BadGatewayException('Помилка під час оновлення');
      }

      return this.clientSchema.findOne({
        id: dto.id,
        deletedBy: null,
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async softDeleteClient(id: number, userEmail: string): Promise<number> {
    try {
      const existingClient = await this.clientSchema.findOne({
        id,
        deletedBy: null,
      });
      if (!existingClient) {
        throw new NotFoundException(`Не знайдено клієнта з ID ${id}}`);
      }

      const updateResult = await existingClient.updateOne({
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
