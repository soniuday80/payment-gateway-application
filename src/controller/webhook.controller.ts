import { Request, Response } from "express";
import  express  from "express";
import Stripe from "stripe";
import { HandlewebhookEvent } from "../services/webhook.service";
export const handlewebhook = (req: Request, res: Response) => {
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
   const endpoint_secret = process.env.STRIPE_WEBHOOK_SECRET!;


   const sig = req.headers['stripe-signature'] as string; 
   let event: Stripe.Event;
   try {
    // verifying the webhooks signature 
    event = stripe.webhooks.constructEvent(req.body , endpoint_secret , sig);
    HandlewebhookEvent(event)
   } catch (err) {
    console.log(`Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err}`);
   }

}
