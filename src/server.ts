import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import connectDB from './config/db';
import createOrderRouter from './routes/createorder.route';
import webhookRouter from './routes/webhook.route';

  
const app: express.Application = express();
const PORT: number = 3000;



app.use('/webhook', express.raw({ type: 'application/json' }) , webhookRouter); // raw body parser for webhook route to handle Stripe's webhook events
app.use(express.json()); // Middleware to parse JSON bodies
app.use("/create-order" , createOrderRouter) // Use the create order route for handling requests to /create-order

connectDB().then(() => { // Connect to the database first before starting the server 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});