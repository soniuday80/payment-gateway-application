// Create Order Controller
import { Request, Response } from 'express';
import { createorder } from '../services/createorder.service';

export const createOrder = async (req: Request, res: Response) =>{
   const {name , email , amount , phonenumber} = req.body; // Extract name, email, and amount from the request body
   if (!name || !email || !amount || !phonenumber) {
      return res.status(400).json({ error: 'Name, email, amount, and phone number are required' }); // Send a 400 Bad Request response if any required fields are missing
   }
   else
    try {
      const order = await createorder({ name, email, amount: amount, phonenumber }); // Call the createorder service function with the extracted data
      res.status(201).json(order); // Send a 201 Created response with the order details in JSON format
    } catch (error) {
      console.error('Error creating order:', error); // Log any errors that occur during order creation
      res.status(500).json({ error: 'Failed to create order' }); // Send a 500 Internal Server Error response if order creation fails
    }
}
