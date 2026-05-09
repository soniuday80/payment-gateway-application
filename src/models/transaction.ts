import { Schema, model, Document } from 'mongoose';

// Define the interface for the document shape
export interface ITransaction extends Document {
  transactionId: string;
  orderID: string;
  paymentID: string;
  amount: number;
  curency: string;
  email: string;
  phonenumber: string;
  status: string[];
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true },
  orderID:       { type: String, required: true },
  paymentID:     { type: String, required: true },
  amount:        { type: Number, required: true },
  curency:       { type: String, required: true },
  email:         { type: String, required: true },
  phonenumber:   { type: String, required: true },
  status:        { type: [String], required: true },
  createdAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now },
});

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
