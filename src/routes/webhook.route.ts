import express from "express";
import { handlewebhook } from "../controller/webhook.controller";
const webhookRouter: express.Router = express.Router();     

webhookRouter.route('/').post(handlewebhook); // Handle POST requests to /webhook by logging a message

export default webhookRouter;