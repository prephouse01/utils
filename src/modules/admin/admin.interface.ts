import { Schema, Document } from "mongoose";

interface BaseAdmin {
  name: {
    first: string;
    last: string;
  };
  email: string;
  contact: string;
  role: string;
  adminLevel: number;
  disabled: boolean;
  revenue: {
    total: number;
    withdrawable: number;
  };
  notifications: Schema.Types.ObjectId[];
  token?: string;
  avatar?: string;
  bank?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface Admin extends Document, BaseAdmin {}