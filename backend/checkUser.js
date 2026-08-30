import mongoose from "mongoose";
import { ENV } from "./src/lib/env.js";
import User from "./src/models/User.js";

await mongoose.connect(ENV.DB_URL);

console.log("Connected to:", mongoose.connection.host);
console.log("Database:", mongoose.connection.name);

const clerkId = "user_36PtqvIfDwU3pqe53ARXaxtV36d";

const user = await User.findOne({ clerkId });

console.log("USER:", user);

await mongoose.disconnect();