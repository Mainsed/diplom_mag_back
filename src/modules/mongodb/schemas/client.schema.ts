import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ClothSizes } from '@shared/enums/cloth-sizes.enum';

export const CLIENT_MODEL_SCHEMA = Symbol('CLIENT_MODEL_SCHEMA');

export interface IClientSchema extends Document {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  size: ClothSizes;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
}

export const ClientSchema = new mongoose.Schema<IClientSchema>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    size: { type: String, required: false },
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
