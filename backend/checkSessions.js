import mongoose from "mongoose";
import Session from "./src/models/Session.js";
import User from "./src/models/User.js";
import { ENV } from "./src/lib/env.js";

await mongoose.connect(ENV.DB_URL);

console.log("Connected to MongoDB");

const sessions = await Session.find({ status: "active" })
  .populate("host", "name email clerkId")
  .populate("participant", "name email clerkId");

console.log("ACTIVE SESSIONS:");
console.log(JSON.stringify(sessions, null, 2));

await mongoose.disconnect();