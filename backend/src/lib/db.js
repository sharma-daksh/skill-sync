import mongoose from "mongoose"
import {ENV} from "./env.js"

export const connectDB =async()=>{
    try{
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("✅Connected to mongodb",conn.connection.host)
    }catch(error){
        console.error("error connecting to mongodb",error);
        process.exit(1);//0=success 1=failure
    }
}