import mongoose from "mongoose";
import User from "./src/models/User.js";
import { ENV } from "./src/lib/env.js";

await mongoose.connect(ENV.DB_URL);

const clerkId = "user_36PtqvIfDwU3pqe53ARXaxtV36d";

const user = await User.findOneAndUpdate(
    { clerkId },
    {
        clerkId,
        email: "daksharma015@gmail.com",
        name: "Daksh",
        profileImage: ""
    },
    {
        new: true,
        upsert: true
    }
);

console.log("USER CREATED/FOUND:");
console.log(user);

await mongoose.disconnect();