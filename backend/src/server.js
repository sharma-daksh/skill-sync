import express from "express";
import path from "path";
import cors from "cors";
import {serve} from "inngest/express"
import { clerkMiddleware } from '@clerk/express';

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest , functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const __dirname = path.resolve();
// middleware
app.use(express.json());
// credentials:true => server allows browser to include cookies ON REQUEST 
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use(clerkMiddleware);

app.use("/api/inngest",serve({client:inngest,functions}))
app.use("/api/chat",chatRoutes);

app.get("/dss", (req, res) => {
  res.status(200).json({ msg: "success from backend" });
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log("Server runing on port:", ENV.PORT);
    });
  } catch (error) {
    console.error("Error running server",error);
  }
};


startServer();