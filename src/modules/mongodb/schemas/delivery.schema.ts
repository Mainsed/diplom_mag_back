import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ClothSizes } from '@shared/enums/cloth-sizes.enum';
import { DeliveryType } from '@shared/enums/delivery-type.enum';

export const DELIVERY_MODEL_SCHEMA = Symbol('DELIVERY_MODEL_SCHEMA');

export interface IDeliverySizeCount {
  size: ClothSizes;
  count: number;
}

export interface IClothDelivered {
  sizes: IDeliverySizeCount[];
  clothId: number;
}

export interface IDeliverySchema extends Document {
  id: number;
  deliveredTo: number;
  deliveredFrom?: number;
  totalAmountDelivered: number;
  typeOfDelivery: DeliveryType;
  price?: number;
  clothDelivered: IClothDelivered[];
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  deletedBy?: string;
}

export const DeliverySchema = new mongoose.Schema<IDeliverySchema>(
  {
    id: { type: Number, required: true, unique: true },
    deliveredTo: { type: Number, required: true },
    deliveredFrom: { type: Number, required: false },
    totalAmountDelivered: { type: Number, required: true },
    typeOfDelivery: { type: String, required: true },
    price: { type: Number, required: false },
    clothDelivered: { type: [Object], required: true },
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
