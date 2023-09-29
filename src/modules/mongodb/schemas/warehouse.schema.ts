import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ClothSizes } from '@shared/enums/cloth-sizes.enum';

export const WAREHOUSE_MODEL_SCHEMA = Symbol('WAREHOUSE_MODEL_SCHEMA');

export interface IWarehouseSchema extends Document {
  id: number;
  clothId: number;
  storeId: number;
  size: ClothSizes;
  amount: number;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
}

export const WarehouseSchema = new mongoose.Schema<IWarehouseSchema>(
  {
    id: { type: Number, required: true, unique: true },
    clothId: { type: Number, required: true },
    storeId: { type: Number, required: true },
    amount: { type: Number, required: true },
    size: { type: String, required: true },
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
