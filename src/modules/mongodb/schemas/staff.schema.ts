import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const STAFF_MODEL_SCHEMA = Symbol('STAFF_MODEL_SCHEMA');

export interface IStaffSchema extends Document {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  password: string;
  position: string;
  storeId: number;
  isHidden: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
}

export const StaffSchema = new mongoose.Schema<IStaffSchema>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    password: { type: String, required: true },
    position: { type: String, required: true },
    storeId: { type: Number, required: true },
    isHidden: { type: Boolean, required: true },
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
