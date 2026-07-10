// adding dns resolver 
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

// connection to the database 
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectDB = async () => {     
    try {   
        const conn = await mongoose.connect(process.env.MONGO_URI!); // the exclamation mark is used to tell TypeScript that we are sure that MONGO_URI will be defined in the environment variables
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }   
};

export default connectDB;