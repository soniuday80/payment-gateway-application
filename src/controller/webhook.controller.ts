import { Request, Response } from "express";
import Stripe from "stripe";
import { HandlewebhookEvent } from "../services/webhook.service";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // Set the API version to the latest stable version
  apiVersion: '2026-04-22.dahlia'
});
const endpoint_secret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handlewebhook = async (req: Request, res: Response) => {

   const sig = req.headers['stripe-signature'] as string; 
   try {
    // verifying the webhooks signature 
   const event = stripe.webhooks.constructEvent(req.body, sig, endpoint_secret); 
    await HandlewebhookEvent(event)
    // return a 200 response
    return res.status(200).json({ received: true });
   } catch (err) {
    console.log(`Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err}`);
   }

}