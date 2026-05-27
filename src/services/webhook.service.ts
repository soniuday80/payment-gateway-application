// we need to do 4 things
// 1) check for signature of the webhook event to verify that it is coming from stripe or not
// 2) check for idempotency key - session id in our case
// 3) update the order status to paid in db
// 4) save the log of the webhook event in db
import { Transaction } from "../models/transaction"
import { EventLogModel } from "../models/logs"


export const HandlewebhookEvent = async (order :any) => {
    // checking for the type of the event 
    if(order.type === "checkout.session.completed"){
     const idempotencyKey = order.data.object.id; // getting the session id from the webhook event data
     const sessionId = await Transaction.findOne({ sessionId: idempotencyKey }); // finding if there exists a session id in db or not
      if(sessionId && sessionId.status !== "success") { // if there is no session id in db and the payment status is succeeded then we will update the order status to paid in db and save the log of the webhook event in db
        // updating the order status to paid in db
        await Transaction.updateOne(
          {sessionId : idempotencyKey },
           { status: "success", 
             paymentID: order.data.object.payment_intent // this is payment intent id from stripe which we will save in our db to prevent duplicate entries in case of multiple webhook events for the same session id 
          }
        );
      }
      else {
        console.log("Session ID already exists. This event has been processed before.");
      }
      // saving the log of the webhook event in db
      await EventLogModel.create(order); // saving the log of the webhook event in db
}
}

