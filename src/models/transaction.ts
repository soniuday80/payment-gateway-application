import { Schema, model, Document } from 'mongoose';

// Define the interface for the document shape
export interface ITransaction extends Document {
  paymentID: string;
  amount: number;
  currency: string;
  email: string;
  phonenumber: string;
  status: string;
  sessionId?: string; // This is the idempotency key from Stripe
  createdAt: Date;
  updatedAt: Date;
}
// updated the model to include sessionId which is the idempotency key from stripe, this will help us to check if the webhook event is already processed or not by matching the sessionId with the one in the order data

const transactionSchema = new Schema<ITransaction>({
  paymentID:     { type: String, required: false }, // unique payment ID to prevent duplicates
  amount:        { type: Number, required: true },
  currency:       { type: String, required: true },
  email:         { type: String, required: true },
  phonenumber:   { type: String, required: true },
  status: { type: String, required: true, enum: ['created', 'pending', 'success', 'failed'], default: 'created' }, // added enum for proper status checking 
  sessionId:     { type: String, required: false }, 
  createdAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now },
});

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
