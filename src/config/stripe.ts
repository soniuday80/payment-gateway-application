// initalising stripe here
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
export const stripe: any = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Set the API version to the latest stable version
  apiVersion: '2026-04-22.dahlia'
});