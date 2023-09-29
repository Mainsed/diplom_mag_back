import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ClothSizes } from '../../../shared/enums/cloth-sizes.enum';
import { OrderStatuses } from '../../../shared/enums/order-statuses.enum';

export const ORDER_MODEL_SCHEMA = Symbol('ORDER_MODEL_SCHEMA');

export interface IClothId {
  clothId: number;
  amount: number;
  size: ClothSizes;
  storeId?: number;
}

export interface IOrderSchema extends Document {
  id: number;
  clientId: number;
  clothIdList: IClothId[];
  status: OrderStatuses;
  price: number;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
}

export const OrderSchema = new mongoose.Schema<IOrderSchema>(
  {
    id: { type: Number, required: true, unique: true },
    clientId: { type: Number, required: true },
    clothIdList: { type: [Object], required: true },
    status: { type: String, required: true },
    price: { type: Number, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedBy: { type: String, required: false },
    updatedAt: { type: String, required: false },
    deletedBy: { type: String, required: false },
  },
  {
    timestamps: false,
  },
);
