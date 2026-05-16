import { Request, Response } from "express";
import Stripe from "stripe";
import { HandlewebhookEvent } from "../services/webhook.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpoint_secret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handlewebhook = (req: Request, res: Response) => {


   const sig = req.headers['stripe-signature'] as string; 
   let event: Stripe.Event; // why its giving error 
   try {
    // verifying the webhooks signature 
    event = stripe.webhooks.constructEvent(req.body , endpoint_secret , sig);
    HandlewebhookEvent(event)
   } catch (err) {
    console.log(`Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err}`);
   }

}
