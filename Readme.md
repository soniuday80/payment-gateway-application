Stripe Payment Gateway
A production-ready payment gateway integration built with Express, TypeScript, Stripe, and MongoDB. Supports order creation, webhook verification, idempotent payment processing, and full audit logging.

Architecture
User → Frontend (React) → Express Server → Stripe API
                                ↑
                          Stripe Webhook
                          (payment confirmation)
Flow:

User submits payment details on the frontend
Server creates a Stripe Checkout session and saves the order to MongoDB with status created
User is redirected to Stripe's hosted payment page
After payment, Stripe redirects user back to the app
Stripe simultaneously sends a webhook to /webhook confirming payment
Server verifies webhook signature, checks idempotency, updates order status, and logs the event


Tech Stack

Runtime: Node.js + TypeScript
Framework: Express
Database: MongoDB + Mongoose
Payments: Stripe Checkout
Frontend: React + Vite


Project Structure
src/
├── config/
│   ├── db.ts           # MongoDB connection
│   └── stripe.ts       # Stripe client
├── controller/
│   ├── createorder.controller.ts
│   └── webhook.controller.ts
├── models/
│   ├── transaction.ts  # Transaction schema
│   └── logs.ts         # Webhook event log schema
├── routes/
│   ├── createorder.route.ts
│   └── webhook.route.ts
├── services/
│   ├── createorder.service.ts
│   ├── stripe.session.ts
│   └── webhook.service.ts
└── server.ts

Key Concepts Implemented
Idempotency
Before updating any transaction, the webhook handler checks if the sessionId has already been processed with status success. If yes, the duplicate event is ignored. This prevents double-processing when Stripe retries webhooks.
Webhook Signature Verification
Every incoming webhook is verified using Stripe's constructEvent method with the raw request body and webhook secret. Requests with invalid signatures are rejected with a 400 response.
Audit Logging
Every webhook event received from Stripe is logged to a separate EventLog collection regardless of outcome. This provides a complete audit trail for debugging payment issues.
Multi-Processor Ready
Payment processor logic is isolated in its own service layer (stripe.session.ts). Adding a new processor like Razorpay requires only implementing the same interface in a new service file without touching any other logic.

Getting Started
Prerequisites

Node.js 18+
MongoDB Atlas account
Stripe account
Stripe CLI (for local webhook testing)

Installation
bash# Clone the repository
git clone https://github.com/yourusername/stripe-payment-gateway.git
cd stripe-payment-gateway

# Install dependencies
npm install

# Install frontend dependencies
cd my-app
npm install
cd ..
Environment Variables
Create a .env file in the root directory:
envSTRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/payment-gateway
Running Locally
Terminal 1 — Start the backend:
bashnpx ts-node src/server.ts
Terminal 2 — Start Stripe CLI for webhook forwarding:
bashstripe listen --forward-to localhost:3000/webhook
Copy the whsec_... key printed and add it to your .env as STRIPE_WEBHOOK_SECRET.
Terminal 3 — Start the frontend:
bashcd my-app
npm run dev

API Endpoints
POST /create-order
Creates a Stripe Checkout session and saves the order to the database.
Request body:
json{
  "email": "user@example.com",
  "phonenumber": "+91 98765 43210",
  "amount": 1499
}
Response:
json{
  "order": {
    "sessionId": "cs_test_...",
    "email": "user@example.com",
    "status": "created"
  },
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
POST /webhook
Receives and processes Stripe webhook events. Handles checkout.session.completed and checkout.session.expired.

Testing
Use Stripe's test card to simulate payments:
Card NumberScenario4242 4242 4242 4242Payment success4000 0000 0000 0002Payment declined4000 0025 0000 3155Requires authentication
Use any future expiry date and any 3-digit CVV.

Database Schema
Transaction
FieldTypeDescriptionsessionIdStringStripe Checkout session IDpaymentIDStringStripe Payment Intent ID (set by webhook)amountNumberPayment amountcurrencyStringPayment currencyemailStringCustomer emailphonenumberStringCustomer phonestatusEnumcreated / pending / success / failed
EventLog
Stores the complete raw Stripe webhook event payload for audit purposes.