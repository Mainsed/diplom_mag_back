import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ClothSizes } from '@shared/enums/cloth-sizes.enum';

export const CLOTH_MODEL_SCHEMA = Symbol('CLOTH_MODEL_SCHEMA');

export interface IClothSchema extends Document {
  id: number;
  name: string;
  price: number;
  desc: string;
  availableSizes: ClothSizes[];
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
}

export const ClothSchema = new mongoose.Schema<IClothSchema>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    availableSizes: { type: [String], required: false },
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
