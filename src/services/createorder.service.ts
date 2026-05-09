import { createStripesession } from './stripe.session';
import { Transaction } from '../models/transaction';
interface OrderData {
    name: string;
    email: string;  
    amount: number;
    phonenumber: string;
}   
export const createorder = async (orderdata: OrderData) => {
    try {
        // 1. call stripe first to get sessionId and url
        const { sessionId, url } = await createStripesession(orderdata.amount, orderdata.email);

        // 2. build order data now that we have sessionId
        const result = {
            email: orderdata.email,
            phonenumber: orderdata.phonenumber,
            status: ["created"],
            sessionId: sessionId
        }

        // 3. save to DB
        const order = await Transaction.create(result);

        // 4. return order and url so controller can send url to frontend
        return { order, url };

    } catch (error) {
        console.error(error);
        throw error;
    }
}