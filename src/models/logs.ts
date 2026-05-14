// creating the model for webhooks log
import { Schema, model, Document } from 'mongoose';

// Define the interface for the document shape
export interface EventLog extends Document {
    id: string;                    
    object: 'event';               
    api_version: string;           
    created: number;               
    type: string;                  
    livemode: boolean;             
    pending_webhooks: number;      // Number of pending webhooks
    request: {
        id: string | null;         // req_abc123
        idempotency_key: string | null;
    };
    data: {
        object: any;               // The actual Stripe object
        previous_attributes?: any; // Only for *.updated events
    };
    
    // Your additional tracking fields
    processed?: boolean;
    processed_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

// define the schema
const eventLogSchema = new Schema<EventLog>({
    id: { type: String, required: true, unique: true },
    object: { type: String, required: true },
    api_version: { type: String, required: true },
    created: { type: Number, required: true },
    type: { type: String, required: true },  
    livemode: { type: Boolean, required: true },
    pending_webhooks: { type: Number, required: true },
    request: {
        id: { type: String, default: null },
        idempotency_key: { type: String, default: null },
    },
    data: { type: Schema.Types.Mixed, required: true }, // Store the entire data object
    processed: { type: Boolean, default: false },
    processed_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});
export const EventLogModel = model<EventLog>('EventLog', eventLogSchema);