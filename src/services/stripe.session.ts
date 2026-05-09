// stripe session file and its functions that will be imported in the create order service
import {stripe} from '../config/stripe'; 

export const createStripesession = async (amount: number , email: any) =>{  
    const session = await stripe.checkout.sessions.create({
        mode : 'payment',
        line_items: [
        {
          price_data: {
              currency: 'inr', // set the country
              product_data: { 
                  name: 'Order Payment',
              },
              unit_amount: amount * 100, // Convert to smallest currency unit   
            },
          quantity: 1,  
        }
      ],
        success_url: 'http://localhost:3000/success', // redirect to this url after successful payment
        cancel_url: 'http://localhost:3000/cancel', // redirect to this url if payment is cancelled
        customer_email: email, // set the customer's email for receipt and communication
    })



   return {
    sessionId: session.id, 
    url:session.url
  }  

}

// // Redirect to the hosted Stripe page remember to use in frontend when the session is created and the url is returned from the backend
// window.location.href = session.url;
// rough comment
// so there is no logic about how succes and cancel routes will work in the backend because these are just redirect urls and the logic for handling these routes can be implemented in the frontend as per the requirement of the application.