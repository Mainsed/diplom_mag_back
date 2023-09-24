import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const STORE_MODEL_SCHEMA = Symbol('STORE_MODEL_SCHEMA');

export interface IStoreSchema extends Document {
  id: number;
  address: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
}

export const StoreSchema = new mongoose.Schema<IStoreSchema>(
  {
    id: { type: Number, required: true, unique: true },
    address: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true },
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
