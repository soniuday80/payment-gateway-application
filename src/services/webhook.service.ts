// we need to do 4 things
// 2) check for idempotency key - session id in our case
// 3) update the order status to paid in db
// 4) save the log of the webhook event in db
import { Transaction } from "../models/transaction"
import { EventLogModel } from "../models/logs"
import { error } from "node:console"


export const HandlewebhookEvent = async (order :any) => {
    if(order.type === "order.created"){
        const idempotencyKey = order.request.idempotency_key;    
     const sessionId = await Transaction.findOne({ where : { sessionId: idempotencyKey } }); // finding if there exists a session id in db or not
      if(sessionId){
        error("session id already exist in db")
      }
      else {
        // updating the order status to paid in db
        await Transaction.updateOne({status : "paid"}, { where : { sessionId : idempotencyKey } }); // updating the order status to paid in db
        await EventLogModel.create(order); // saving the log of the webhook event in db
      }
}
}

