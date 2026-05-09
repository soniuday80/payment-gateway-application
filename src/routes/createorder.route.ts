// Route for creating an order
import express from 'express';
import { createOrder } from '../controller/createorder.controller';

const router: express.Router = express.Router();    
router.route('/').post(createOrder) // Handle POST requests to /create-order by calling the createOrder controller function

export default router;